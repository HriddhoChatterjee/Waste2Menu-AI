"""
KitchenOS Scrap Ingestion & Reservoir API Router
================================================
Endpoints for logging kitchen prep scrap, evaluating knife-efficiency / yield anomalies,
updating raw ingredient inventories, and querying the active scrap reservoir.
"""

from __future__ import annotations

from typing import List
from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func

from app.dependencies import DBSession
from app.models import (
    RawInventory,
    ScrapCategory,
    ScrapLedger,
    ScrapStatus,
)
from app.schemas import (
    RawInventoryResponse,
    ReservoirItem,
    ReservoirResponse,
    ScrapLogCreate,
    ScrapLogResponse,
)
from app.services.anomaly_detection import anomaly_detector

router = APIRouter(prefix="/scrap", tags=["Scrap Ingestion & Reservoir"])


def _derive_scrap_category(category_str: str) -> ScrapCategory:
    """Maps raw inventory category string to a standard ScrapCategory enum."""
    cat = category_str.upper().strip()
    if "POULTRY" in cat or "MEAT" in cat or "FISH" in cat or "BONE" in cat:
        return ScrapCategory.BONES
    if "CITRUS" in cat or "LEMON" in cat or "ORANGE" in cat:
        return ScrapCategory.CITRUS
    if "HERB" in cat or "CORIANDER" in cat or "MINT" in cat:
        return ScrapCategory.HERB_STEMS
    return ScrapCategory.VEGETABLE_SKINS


# ─────────────────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.post(
    "/log",
    response_model=ScrapLogResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Log prep scrap event with anomaly detection",
    description=(
        "Ingests prep yields, calculates trim ratio, detects yield anomalies "
        "via Isolation Forest, decrements raw inventory, and adds scrap to the reservoir."
    ),
)
async def log_prep_scrap(
    payload: ScrapLogCreate,
    db: DBSession,
) -> ScrapLogResponse:
    # 1. Validation: Positive weights
    if payload.usable_weight_kg <= 0.0 or payload.scrap_weight_kg <= 0.0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usable weight and scrap weight must both be strictly greater than 0 kg.",
        )

    # 2. Validation: Raw inventory existence
    raw_item = db.query(RawInventory).filter(RawInventory.id == payload.raw_inventory_id).first()
    if not raw_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Raw inventory ingredient with ID {payload.raw_inventory_id} was not found.",
        )

    # 3. Validation: Stock sufficiency
    total_batch_weight = payload.usable_weight_kg + payload.scrap_weight_kg
    if raw_item.stock_kg < total_batch_weight:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Insufficient inventory stock for '{raw_item.name}'. "
                f"Required: {total_batch_weight:.2f} kg, Current Stock: {raw_item.stock_kg:.2f} kg."
            ),
        )

    # 4. Calculate Trim Ratio
    trim_ratio = payload.scrap_weight_kg / total_batch_weight
    if not (0.0 <= trim_ratio <= 1.0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Calculated trim ratio {trim_ratio:.4f} is mathematically invalid (must be between 0 and 1).",
        )

    # 5. Run ML Anomaly Detection (Isolation Forest with Baseline Fallback)
    is_anomaly, anomaly_score = anomaly_detector.detect_anomaly(
        db=db,
        raw_inventory=raw_item,
        usable_weight_kg=payload.usable_weight_kg,
        scrap_weight_kg=payload.scrap_weight_kg,
        trim_ratio=trim_ratio,
    )

    # 6. Determine Scrap Category
    scrap_cat = _derive_scrap_category(raw_item.category)

    # 7. Update Inventory Stock (Atomic Decrement)
    raw_item.stock_kg = round(raw_item.stock_kg - total_batch_weight, 4)

    # 8. Create Immutable Scrap Record
    scrap_record = ScrapLedger(
        cook_id=payload.cook_id,
        raw_inventory_id=raw_item.id,
        scrap_category=scrap_cat,
        usable_weight_kg=payload.usable_weight_kg,
        scrap_weight_kg=payload.scrap_weight_kg,
        trim_ratio=round(trim_ratio, 4),
        is_anomaly=is_anomaly,
        status=ScrapStatus.AVAILABLE,
    )
    db.add(scrap_record)
    db.commit()
    db.refresh(scrap_record)

    return scrap_record


@router.get(
    "/reservoir",
    response_model=ReservoirResponse,
    summary="Get aggregated available scrap reservoir",
    description="Returns available scrap inventory categorized by scrap type for reverse recipe generation.",
)
async def get_scrap_reservoir(
    db: DBSession,
) -> ReservoirResponse:
    # Group sum of available scraps by category
    category_totals = (
        db.query(
            ScrapLedger.scrap_category,
            func.sum(ScrapLedger.scrap_weight_kg).label("total_weight"),
        )
        .filter(ScrapLedger.status == ScrapStatus.AVAILABLE)
        .group_by(ScrapLedger.scrap_category)
        .all()
    )

    totals_dict = {cat.value: 0.0 for cat in ScrapCategory}
    for cat_enum, total in category_totals:
        totals_dict[cat_enum.value] = round(float(total or 0.0), 3)

    reservoir_items = [
        ReservoirItem(
            category=ScrapCategory(cat_val),
            total_weight_kg=totals_dict[cat_val],
        )
        for cat_val in totals_dict
    ]

    total_available = round(sum(totals_dict.values()), 3)

    return ReservoirResponse(
        reservoir=reservoir_items,
        total_available_kg=total_available,
    )


@router.get(
    "/inventory",
    response_model=List[RawInventoryResponse],
    summary="List all raw ingredients and stocks",
)
async def list_raw_inventory(
    db: DBSession,
) -> List[RawInventoryResponse]:
    """Returns all raw inventory items tracked in KitchenOS."""
    return db.query(RawInventory).order_by(RawInventory.name.asc()).all()
