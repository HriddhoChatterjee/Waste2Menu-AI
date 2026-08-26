"""
KitchenOS Reverse Recipe Solver & Batch Approval API Router
============================================================
Endpoints for generating mathematically optimal byproduct menu offerings from available
prep scrap using PuLP Integer Linear Programming (ILP) and atomically allocating scrap batches.
"""

from __future__ import annotations

from typing import List
from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func

from app.dependencies import DBSession
from app.models import (
    ByproductRecipe,
    DynamicSku,
    ScrapCategory,
    ScrapLedger,
    ScrapStatus,
    SkuStatus,
)
from app.schemas import (
    ApproveBatchRequest,
    ByproductRecipeCreate,
    ByproductRecipeResponse,
    DynamicSkuResponse,
    FeasibleRecipeCard,
)
from app.services.recipe_solver import recipe_solver

router = APIRouter(prefix="/recipes", tags=["Reverse Recipe Solver & Specials Formulation"])


@router.get(
    "/match-feasible",
    response_model=List[FeasibleRecipeCard],
    summary="Solve feasible daily special batches from available scrap",
    description=(
        "Runs PuLP Integer Linear Programming (ILP) optimization over active scrap reservoirs. "
        "Enforces minimum batch size (>= 8 portions) and gross margin threshold (> 85%)."
    ),
)
async def match_feasible_recipes(
    db: DBSession,
) -> List[FeasibleRecipeCard]:
    """Solves available scrap into revenue-maximizing, high-margin recipe candidate cards."""
    return recipe_solver.solve_multi_recipe_optimization(db)


@router.post(
    "/approve-batch",
    response_model=DynamicSkuResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Approve recipe batch and atomically allocate scrap into active DynamicSku",
    description=(
        "Locks available scrap records, verifies sufficiency, marks consumed scrap as ALLOCATED "
        "in FIFO order, and instantiates an active DynamicSku ready for POS sale."
    ),
)
async def approve_recipe_batch(
    payload: ApproveBatchRequest,
    db: DBSession,
) -> DynamicSkuResponse:
    # 1. Validate Recipe Existence
    recipe = db.query(ByproductRecipe).filter(ByproductRecipe.id == payload.recipe_id).first()
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Byproduct recipe with ID {payload.recipe_id} not found.",
        )

    # 2. Validate Minimum Batch Threshold
    if payload.portions < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Batch approval requires a minimum of 8 portions.",
        )

    # 3. Calculate Required Scrap Mass
    required_scrap_kg = round(payload.portions * recipe.scrap_per_portion_kg, 4)

    # 4. Fetch Available Scrap for the Recipe Category (FIFO order)
    available_scraps = (
        db.query(ScrapLedger)
        .filter(
            ScrapLedger.scrap_category == recipe.primary_scrap_category,
            ScrapLedger.status == ScrapStatus.AVAILABLE,
        )
        .order_by(ScrapLedger.logged_at.asc())
        .all()
    )

    total_available = sum(s.scrap_weight_kg for s in available_scraps)
    if total_available < required_scrap_kg:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"Insufficient available {recipe.primary_scrap_category.value} scrap for this batch. "
                f"Required: {required_scrap_kg:.2f} kg, Available: {total_available:.2f} kg."
            ),
        )

    # 5. Transaction-Safe Scrap Allocation (FIFO Consumption)
    remaining_needed = required_scrap_kg

    for scrap_record in available_scraps:
        if remaining_needed <= 0:
            break

        if scrap_record.scrap_weight_kg <= remaining_needed:
            # Full record consumed
            remaining_needed = round(remaining_needed - scrap_record.scrap_weight_kg, 4)
            scrap_record.status = ScrapStatus.ALLOCATED
        else:
            # Partial record consumed -> Split record
            leftover_weight = round(scrap_record.scrap_weight_kg - remaining_needed, 4)

            # Mark current record as allocated with exact consumed weight
            scrap_record.scrap_weight_kg = remaining_needed
            scrap_record.status = ScrapStatus.ALLOCATED

            # Create new available ledger entry for the remaining unconsumed scrap
            leftover_record = ScrapLedger(
                cook_id=scrap_record.cook_id,
                raw_inventory_id=scrap_record.raw_inventory_id,
                scrap_category=scrap_record.scrap_category,
                usable_weight_kg=scrap_record.usable_weight_kg,
                scrap_weight_kg=leftover_weight,
                trim_ratio=scrap_record.trim_ratio,
                is_anomaly=scrap_record.is_anomaly,
                status=ScrapStatus.AVAILABLE,
                logged_at=scrap_record.logged_at,
            )
            db.add(leftover_record)
            remaining_needed = 0.0

    # 6. Instantiate DynamicSku for POS
    dynamic_sku = DynamicSku(
        recipe_id=recipe.id,
        item_name=recipe.name,
        total_portions=payload.portions,
        remaining_portions=payload.portions,
        unit_price=recipe.suggested_price,
        status=SkuStatus.ACTIVE,
    )
    db.add(dynamic_sku)

    # 7. Commit Transaction Atomically
    db.commit()
    db.refresh(dynamic_sku)

    return dynamic_sku


@router.get(
    "/",
    response_model=List[ByproductRecipeResponse],
    summary="List all byproduct recipes",
)
async def list_all_recipes(
    db: DBSession,
) -> List[ByproductRecipeResponse]:
    """Returns all byproduct recipe formulations configured in KitchenOS."""
    return db.query(ByproductRecipe).order_by(ByproductRecipe.name.asc()).all()


@router.post(
    "/",
    response_model=ByproductRecipeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new byproduct recipe formulation",
)
async def create_byproduct_recipe(
    payload: ByproductRecipeCreate,
    db: DBSession,
) -> ByproductRecipeResponse:
    """Adds a new byproduct recipe formulation to KitchenOS."""
    existing = db.query(ByproductRecipe).filter(ByproductRecipe.name == payload.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A byproduct recipe with the name '{payload.name}' already exists.",
        )

    recipe = ByproductRecipe(**payload.model_dump())
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return recipe
