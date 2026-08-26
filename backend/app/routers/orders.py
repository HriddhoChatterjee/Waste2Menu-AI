"""POS Orders router — atomic portion decrement with sold-out guard."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import DailySpecial, Order, OrderStatus, SpecialStatus
from app.schemas import MessageResponse, OrderCreate, OrderOut

router = APIRouter(prefix="/orders", tags=["POS Orders"])
DB = Annotated[AsyncSession, Depends(get_db)]


@router.get("", response_model=list[OrderOut])
async def list_orders(
    db: DB,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    special_id: int | None = None,
) -> list[OrderOut]:
    stmt = select(Order).order_by(desc(Order.created_at)).offset(skip).limit(limit)
    if special_id:
        stmt = stmt.where(Order.special_id == special_id)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.post("", response_model=OrderOut, status_code=201)
async def place_order(body: OrderCreate, db: DB) -> OrderOut:
    """
    Atomically:
    1. Validate the special is active.
    2. Check remaining portions.
    3. Decrement portions_sold.
    4. Flip status to sold_out if exhausted.
    5. Persist Order.
    """
    special = await db.get(DailySpecial, body.special_id)
    if not special:
        raise HTTPException(status_code=404, detail="Daily special not found.")
    if special.status != SpecialStatus.ACTIVE:
        raise HTTPException(
            status_code=409,
            detail=f"Special is not active (current status: {special.status.value}).",
        )

    remaining = special.max_portions - special.portions_sold
    if body.portions > remaining:
        raise HTTPException(
            status_code=409,
            detail=f"Only {remaining} portions remaining.",
        )

    # Atomic decrement
    special.portions_sold += body.portions
    if special.portions_sold >= special.max_portions:
        special.status = SpecialStatus.SOLD_OUT

    total = round(special.final_price * body.portions, 2)
    order = Order(
        special_id=body.special_id,
        table_number=body.table_number,
        portions=body.portions,
        unit_price=special.final_price,
        total_price=total,
        status=OrderStatus.COMPLETED,
    )
    db.add(order)
    await db.flush()
    await db.refresh(order)
    return order


@router.get("/{order_id}", response_model=OrderOut)
async def get_order(order_id: int, db: DB) -> OrderOut:
    order = await db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order


@router.patch("/{order_id}/cancel", response_model=OrderOut)
async def cancel_order(order_id: int, db: DB) -> OrderOut:
    order = await db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    if order.status == OrderStatus.CANCELLED:
        raise HTTPException(status_code=409, detail="Order already cancelled.")

    # Re-instate portions on the special
    special = await db.get(DailySpecial, order.special_id)
    if special:
        special.portions_sold = max(0, special.portions_sold - order.portions)
        if special.status == SpecialStatus.SOLD_OUT and special.portions_sold < special.max_portions:
            special.status = SpecialStatus.ACTIVE

    order.status = OrderStatus.CANCELLED
    await db.flush()
    await db.refresh(order)
    return order
