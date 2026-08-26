"""
KitchenOS Point-of-Sale (POS) API Router
========================================
Endpoints for customer/cashier live daily special menus and atomic order checkout
with real-time stock protection and SOLD_OUT automated transitions.
"""

from __future__ import annotations

from typing import List
from fastapi import APIRouter, status

from app.dependencies import DBSession
from app.models import Order
from app.schemas import (
    BillingSummaryResponse,
    LiveMenuItemResponse,
    OrderCreate,
    OrderResponse,
)
from app.services.inventory_service import pos_service

router = APIRouter(prefix="/pos", tags=["Point of Sale (POS) & Ordering"])


@router.get(
    "/live-menu",
    response_model=List[LiveMenuItemResponse],
    summary="Get live customer-facing dynamic specials menu",
    description="Returns all active daily byproduct specials with real-time portions, pricing, and scarcity badges.",
)
async def get_live_menu(
    db: DBSession,
) -> List[LiveMenuItemResponse]:
    """Fetches the real-time POS menu of active dynamic scrap specials."""
    return pos_service.get_live_menu(db)


@router.post(
    "/order",
    response_model=BillingSummaryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Place order and atomically decrement SKU portions",
    description=(
        "Validates stock sufficiency, decrements portions, automatically flips status to SOLD_OUT "
        "when 0 portions remain, and returns an itemized billing receipt."
    ),
)
async def place_order(
    payload: OrderCreate,
    db: DBSession,
) -> BillingSummaryResponse:
    """Processes customer order for a daily special item atomically."""
    return pos_service.process_order(db=db, payload=payload)


@router.get(
    "/orders",
    response_model=List[OrderResponse],
    summary="List all placed POS orders",
)
async def list_orders(
    db: DBSession,
) -> List[OrderResponse]:
    """Returns all historic and active POS order records."""
    return db.query(Order).order_by(Order.ordered_at.desc()).all()
