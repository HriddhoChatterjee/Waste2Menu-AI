"""Ingredient CRUD router."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Ingredient
from app.schemas import (
    IngredientCreate,
    IngredientOut,
    IngredientUpdate,
    MessageResponse,
)

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])
DB = Annotated[AsyncSession, Depends(get_db)]


@router.get("", response_model=list[IngredientOut])
async def list_ingredients(
    db: DB,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    station: str | None = None,
) -> list[IngredientOut]:
    stmt = select(Ingredient)
    if station:
        stmt = stmt.where(Ingredient.station == station)
    stmt = stmt.offset(skip).limit(limit).order_by(Ingredient.name)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.post("", response_model=IngredientOut, status_code=201)
async def create_ingredient(body: IngredientCreate, db: DB) -> IngredientOut:
    # Check uniqueness
    existing = await db.execute(select(Ingredient).where(Ingredient.name == body.name))
    if existing.scalars().first():
        raise HTTPException(status_code=409, detail=f"Ingredient '{body.name}' already exists.")

    ing = Ingredient(**body.model_dump())
    db.add(ing)
    await db.flush()
    await db.refresh(ing)
    return ing


@router.get("/{ingredient_id}", response_model=IngredientOut)
async def get_ingredient(ingredient_id: int, db: DB) -> IngredientOut:
    ing = await db.get(Ingredient, ingredient_id)
    if not ing:
        raise HTTPException(status_code=404, detail="Ingredient not found.")
    return ing


@router.patch("/{ingredient_id}", response_model=IngredientOut)
async def update_ingredient(ingredient_id: int, body: IngredientUpdate, db: DB) -> IngredientOut:
    ing = await db.get(Ingredient, ingredient_id)
    if not ing:
        raise HTTPException(status_code=404, detail="Ingredient not found.")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(ing, field, value)

    await db.flush()
    await db.refresh(ing)
    return ing


@router.delete("/{ingredient_id}", response_model=MessageResponse)
async def delete_ingredient(ingredient_id: int, db: DB) -> MessageResponse:
    ing = await db.get(Ingredient, ingredient_id)
    if not ing:
        raise HTTPException(status_code=404, detail="Ingredient not found.")
    await db.delete(ing)
    return MessageResponse(message=f"Ingredient {ingredient_id} deleted.")


@router.post("/{ingredient_id}/stock", response_model=IngredientOut)
async def adjust_stock(
    ingredient_id: int,
    delta_g: float,
    db: DB,
) -> IngredientOut:
    """Add (positive) or subtract (negative) stock atomically."""
    ing = await db.get(Ingredient, ingredient_id)
    if not ing:
        raise HTTPException(status_code=404, detail="Ingredient not found.")

    new_stock = ing.current_stock_g + delta_g
    if new_stock < 0:
        raise HTTPException(status_code=400, detail="Stock cannot go below zero.")

    ing.current_stock_g = new_stock
    await db.flush()
    await db.refresh(ing)
    return ing
