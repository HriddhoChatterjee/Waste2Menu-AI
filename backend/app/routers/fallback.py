"""
KitchenOS NGO Redistribution Fallback API Router
================================================
Endpoints for triggering end-of-shift surplus sweeps, proximity-based NGO claiming
with cryptographically secure OTP generation, and cashier handover verification.
"""

from __future__ import annotations

from typing import List
from fastapi import APIRouter, HTTPException, status

from app.dependencies import DBSession
from app.models import NGO, RedistributionBatch
from app.schemas import (
    ClaimBatchRequest,
    ClaimBatchResponse,
    NGOBatchCreate,
    NGOResponse,
    RedistributionBatchResponse,
    TriggerSurplusResponse,
    VerifyHandoverRequest,
    VerifyHandoverResponse,
)
from app.services.ngo_service import ngo_service

router = APIRouter(prefix="/fallback", tags=["NGO Redistribution & Surplus Fallback"])


@router.post(
    "/trigger-surplus",
    response_model=TriggerSurplusResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Trigger end-of-shift surplus meal sweep",
    description=(
        "Converts all unsold active specials into redistribution batches and calculates "
        "geospatial Haversine distance to rank verified local NGO shelter partners."
    ),
)
async def trigger_surplus_sweep(
    db: DBSession,
) -> TriggerSurplusResponse:
    """Sweeps remaining POS special portions into NGO donation batches."""
    return ngo_service.trigger_surplus(db)


@router.post(
    "/claim",
    response_model=ClaimBatchResponse,
    summary="Claim an offered surplus batch (NGO partner)",
    description=(
        "Locks the batch, verifies OFFERED state, prevents double claims, and issues "
        "a cryptographically secure 6-digit OTP for kitchen pickup."
    ),
)
async def claim_surplus_batch(
    payload: ClaimBatchRequest,
    db: DBSession,
) -> ClaimBatchResponse:
    """Allows an NGO partner to claim an available surplus meal batch."""
    return ngo_service.claim_batch(db=db, batch_id=payload.batch_id, ngo_id=payload.ngo_id)


@router.post(
    "/verify-handover",
    response_model=VerifyHandoverResponse,
    summary="Verify pickup OTP and complete food donation handover",
    description=(
        "Validates the presented 6-digit OTP code, transitions the batch to COMPLETED, "
        "and logs ESG sustainability metrics (meals donated, scrap diverted, CO2e avoided)."
    ),
)
async def verify_batch_handover(
    payload: VerifyHandoverRequest,
    db: DBSession,
) -> VerifyHandoverResponse:
    """Cashier terminal endpoint verifying the physical handover of meals."""
    return ngo_service.verify_handover(db=db, batch_id=payload.batch_id, pickup_otp=payload.pickup_otp)


@router.get(
    "/batches",
    response_model=List[RedistributionBatchResponse],
    summary="List all redistribution batches",
)
async def list_redistribution_batches(
    db: DBSession,
) -> List[RedistributionBatchResponse]:
    """Returns all surplus batches across OFFERED, CLAIMED, and COMPLETED states."""
    return db.query(RedistributionBatch).order_by(RedistributionBatch.created_at.desc()).all()


@router.get(
    "/ngos",
    response_model=List[NGOResponse],
    summary="List all registered NGO shelter partners",
)
async def list_ngos(
    db: DBSession,
) -> List[NGOResponse]:
    """Returns all verified NGO partners."""
    return db.query(NGO).order_by(NGO.name.asc()).all()


@router.post(
    "/ngos",
    response_model=NGOResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new NGO shelter partner",
)
async def register_ngo(
    payload: NGOBatchCreate,
    db: DBSession,
) -> NGOResponse:
    """Enrolls a new NGO partner with geocoordinates and meal capacity."""
    existing = db.query(NGO).filter(NGO.name == payload.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An NGO named '{payload.name}' is already registered.",
        )
    ngo = NGO(**payload.model_dump())
    db.add(ngo)
    db.commit()
    db.refresh(ngo)
    return ngo
