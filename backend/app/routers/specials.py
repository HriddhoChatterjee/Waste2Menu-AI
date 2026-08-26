"""Daily Specials — ILP-driven generation, CRUD, and batch feasibility."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.ml_services import (
    RecipeIngredientSpec,
    ilp_batch_feasibility,
    score_recipes_for_specials,
)
from app.models import (
    DailySpecial,
    Ingredient,
    Recipe,
    RecipeIngredient,
    ScrapLog,
    SpecialStatus,
)
from app.schemas import (
    BatchFeasibilityRequest,
    BatchFeasibilityResponse,
    DailySpecialOut,
    DailySpecialUpdate,
    GenerateSpecialsRequest,
    MessageResponse,
)

router = APIRouter(prefix="/specials", tags=["Daily Specials"])
DB = Annotated[AsyncSession, Depends(get_db)]


async def _load_special(special_id: int, db: AsyncSession) -> DailySpecial:
    stmt = (
        select(DailySpecial)
        .where(DailySpecial.id == special_id)
        .options(
            selectinload(DailySpecial.recipe).selectinload(Recipe.ingredients)
        )
    )
    result = await db.execute(stmt)
    sp = result.scalars().first()
    if not sp:
        raise HTTPException(status_code=404, detail="Daily special not found.")
    return sp


@router.get("", response_model=list[DailySpecialOut])
async def list_specials(
    db: DB,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    active_only: bool = False,
) -> list[DailySpecialOut]:
    stmt = (
        select(DailySpecial)
        .options(selectinload(DailySpecial.recipe).selectinload(Recipe.ingredients))
        .order_by(desc(DailySpecial.created_at))
        .offset(skip).limit(limit)
    )
    if active_only:
        stmt = stmt.where(DailySpecial.status == SpecialStatus.ACTIVE)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.post("/generate", response_model=list[DailySpecialOut], status_code=201)
async def generate_specials(body: GenerateSpecialsRequest, db: DB) -> list[DailySpecialOut]:
    """
    Use ILP + scrap utilisation scores to auto-generate today's Daily Specials.
    1. Fetch all active recipes with ingredients.
    2. Build scrap_map from today's ScrapLog entries.
    3. Score + rank with ML module.
    4. Persist DailySpecial records.
    """
    # Load recipes
    stmt = (
        select(Recipe)
        .where(Recipe.is_active == True)
        .options(selectinload(Recipe.ingredients).selectinload(RecipeIngredient.ingredient))
    )
    recipes_result = await db.execute(stmt)
    recipes = recipes_result.scalars().all()

    if not recipes:
        raise HTTPException(status_code=422, detail="No active recipes found to generate specials.")

    # Build scrap map (ingredient_id → total scrapped today)
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    scrap_stmt = select(ScrapLog).where(ScrapLog.logged_at >= today_start)
    scrap_result = await db.execute(scrap_stmt)
    scrap_logs = scrap_result.scalars().all()

    scrap_map: dict[int, float] = {}
    for sl in scrap_logs:
        scrap_map[sl.ingredient_id] = scrap_map.get(sl.ingredient_id, 0.0) + sl.quantity_scrapped_g

    # Build stock map
    stock_stmt = select(Ingredient)
    stock_result = await db.execute(stock_stmt)
    stock_map = {i.id: i.current_stock_g for i in stock_result.scalars().all()}

    # Serialise recipes for scorer
    recipes_data = []
    for r in recipes:
        recipes_data.append({
            "id": r.id,
            "name": r.name,
            "base_price": r.base_price,
            "ingredients": [
                {
                    "ingredient_id": ri.ingredient_id,
                    "name": ri.ingredient.name if ri.ingredient else str(ri.ingredient_id),
                    "quantity_g": ri.quantity_g,
                }
                for ri in r.ingredients
            ],
        })

    scored = score_recipes_for_specials(
        recipes=recipes_data,
        scrap_map=scrap_map,
        stock_map=stock_map,
        max_specials=body.max_specials,
        discount_pct=body.discount_pct,
        min_scrap_utilisation=body.min_scrap_utilisation,
    )

    if not scored:
        raise HTTPException(
            status_code=422,
            detail="No recipes met the minimum scrap utilisation threshold. Log more scrap events first.",
        )

    created: list[DailySpecial] = []
    for s in scored:
        sp = DailySpecial(
            recipe_id=s.recipe_id,
            final_price=s.final_price,
            discount_pct=s.discount_pct,
            max_portions=max(1, s.max_portions),
            status=SpecialStatus.ACTIVE,
            scrap_utilisation_pct=s.scrap_utilisation_pct,
            ilp_batch_score=s.ilp_batch_score,
        )
        db.add(sp)
        created.append(sp)

    await db.flush()

    # Reload with relationships
    result_list: list[DailySpecial] = []
    for sp in created:
        await db.refresh(sp)
        loaded = await _load_special(sp.id, db)
        result_list.append(loaded)

    return result_list


@router.get("/{special_id}", response_model=DailySpecialOut)
async def get_special(special_id: int, db: DB) -> DailySpecialOut:
    return await _load_special(special_id, db)


@router.patch("/{special_id}", response_model=DailySpecialOut)
async def update_special(special_id: int, body: DailySpecialUpdate, db: DB) -> DailySpecialOut:
    sp = await db.get(DailySpecial, special_id)
    if not sp:
        raise HTTPException(status_code=404, detail="Daily special not found.")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(sp, field, value)
    await db.flush()
    return await _load_special(special_id, db)


@router.delete("/{special_id}", response_model=MessageResponse)
async def delete_special(special_id: int, db: DB) -> MessageResponse:
    sp = await db.get(DailySpecial, special_id)
    if not sp:
        raise HTTPException(status_code=404, detail="Daily special not found.")
    await db.delete(sp)
    return MessageResponse(message=f"Special {special_id} deleted.")


@router.post("/batch-check", response_model=BatchFeasibilityResponse)
async def batch_feasibility_check(body: BatchFeasibilityRequest, db: DB) -> BatchFeasibilityResponse:
    """ILP-based batch feasibility check for any recipe + desired portion count."""
    stmt = (
        select(Recipe)
        .where(Recipe.id == body.recipe_id)
        .options(selectinload(Recipe.ingredients).selectinload(RecipeIngredient.ingredient))
    )
    result = await db.execute(stmt)
    recipe = result.scalars().first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found.")

    specs = [
        RecipeIngredientSpec(
            ingredient_id=ri.ingredient_id,
            name=ri.ingredient.name if ri.ingredient else str(ri.ingredient_id),
            quantity_g_per_portion=ri.quantity_g,
            available_stock_g=ri.ingredient.current_stock_g if ri.ingredient else 0.0,
        )
        for ri in recipe.ingredients
    ]

    ilp_result = ilp_batch_feasibility(
        desired_portions=body.desired_portions,
        ingredients=specs,
    )

    return BatchFeasibilityResponse(
        recipe_id=body.recipe_id,
        desired_portions=body.desired_portions,
        feasible_portions=ilp_result.feasible_portions,
        limiting_ingredient=ilp_result.limiting_ingredient,
        score=ilp_result.score,
    )
