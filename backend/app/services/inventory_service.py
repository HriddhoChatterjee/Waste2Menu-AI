"""
KitchenOS Point-of-Sale (POS) & SKU Inventory Service
=====================================================
Handles live menu generation, atomic SKU stock decrements, order billing calculations,
and automated SOLD_OUT state transitions.
"""

from __future__ import annotations

import logging
from typing import List, Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import DynamicSku, Order, SkuStatus
from app.schemas import BillingSummaryResponse, LiveMenuItemResponse, OrderCreate

logger = logging.getLogger("kitchenos.pos")


class POSInventoryService:
    """Service handling POS transactions and dynamic SKU stock management."""

    def _determine_badge(self, remaining: int, total: int) -> str:
        """Determines scarcity and promotional badges for the customer-facing menu."""
        if remaining == 0:
            return "SOLD OUT"
        fraction = remaining / total if total > 0 else 0.0
        if fraction <= 0.25 or remaining <= 3:
            return "🔥 High Scarcity - Only Few Left!"
        if fraction <= 0.50:
            return "⚡ Selling Fast"
        return "✨ Chef's Fresh Scrap Special"

    def get_live_menu(self, db: Session) -> List[LiveMenuItemResponse]:
        """
        Retrieves all currently active or newly formed daily specials for the POS menu.
        """
        active_skus = (
            db.query(DynamicSku)
            .filter(DynamicSku.status.in_([SkuStatus.ACTIVE, SkuStatus.SOLD_OUT]))
            .order_by(DynamicSku.status.asc(), DynamicSku.created_at.desc())
            .all()
        )

        menu_items: List[LiveMenuItemResponse] = []
        for sku in active_skus:
            recipe_desc = sku.recipe.description if sku.recipe else ""
            badge = self._determine_badge(sku.remaining_portions, sku.total_portions)
            menu_items.append(
                LiveMenuItemResponse(
                    sku_id=sku.id,
                    item_name=sku.item_name,
                    total_portions=sku.total_portions,
                    remaining_portions=sku.remaining_portions,
                    unit_price=sku.unit_price,
                    status=sku.status,
                    badge=badge,
                    recipe_description=recipe_desc,
                )
            )
        return menu_items

    def process_order(
        self,
        db: Session,
        payload: OrderCreate,
    ) -> BillingSummaryResponse:
        """
        Executes an atomic order checkout:
        1. Validates quantity (> 0).
        2. Locks DynamicSku record.
        3. Enforces SKU is ACTIVE and has sufficient remaining portions.
        4. Decrements remaining portions (never allows negative stock).
        5. Automatically transitions status to SOLD_OUT when remaining == 0.
        6. Creates Order record.
        7. Commits atomically and returns billing summary.
        """
        if payload.quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order quantity must be at least 1 portion.",
            )

        # Fetch SKU
        sku = db.query(DynamicSku).filter(DynamicSku.id == payload.dynamic_sku_id).first()
        if not sku:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Dynamic SKU with ID {payload.dynamic_sku_id} was not found on the POS menu.",
            )

        # Enforce Active Status
        if sku.status == SkuStatus.SOLD_OUT:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"'{sku.item_name}' is completely SOLD OUT and cannot be ordered.",
            )

        if sku.status == SkuStatus.REDISTRIBUTED:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"'{sku.item_name}' has already been redistributed to an NGO partner.",
            )

        # Check Portion Sufficiency
        if sku.remaining_portions < payload.quantity:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    f"Insufficient portions remaining for '{sku.item_name}'. "
                    f"Requested: {payload.quantity}, Available: {sku.remaining_portions}."
                ),
            )

        # Atomic Decrement
        sku.remaining_portions -= payload.quantity

        # State Transition to SOLD_OUT if 0 remaining
        if sku.remaining_portions == 0:
            sku.status = SkuStatus.SOLD_OUT
            logger.info("DynamicSku #%d (%s) marked SOLD_OUT.", sku.id, sku.item_name)

        total_price = round(payload.quantity * sku.unit_price, 2)

        # Create Order record
        order = Order(
            dynamic_sku_id=sku.id,
            quantity=payload.quantity,
            total_price=total_price,
        )
        db.add(order)
        db.commit()
        db.refresh(order)
        db.refresh(sku)

        logger.info(
            "POS Order #%d processed: %d portions of '%s' for Rs.%.2f. Remaining: %d.",
            order.id,
            order.quantity,
            sku.item_name,
            order.total_price,
            sku.remaining_portions,
        )

        return BillingSummaryResponse(
            order_id=order.id,
            item_name=sku.item_name,
            quantity=order.quantity,
            unit_price=sku.unit_price,
            total_price=order.total_price,
            remaining_sku_portions=sku.remaining_portions,
            sku_status=sku.status,
            ordered_at=order.ordered_at,
        )


pos_service = POSInventoryService()
