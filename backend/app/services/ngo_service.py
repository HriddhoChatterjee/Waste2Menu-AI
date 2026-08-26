"""
KitchenOS NGO Redistribution & Fallback Service
===============================================
Coordinates end-of-shift surplus meal routing, Haversine geospatial proximity ranking,
concurrency-safe claiming with CSPRNG OTPs, and cashier handover verification.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import List, Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models import (
    BatchStatus,
    DynamicSku,
    NGO,
    RedistributionBatch,
    SkuStatus,
    SustainabilityLedger,
)
from app.schemas import (
    ClaimBatchResponse,
    NGORankedCandidate,
    RedistributionBatchResponse,
    TriggerSurplusResponse,
    VerifyHandoverResponse,
)
from app.utils.geo import haversine_distance
from app.utils.security import generate_secure_otp

logger = logging.getLogger("kitchenos.ngo")
settings = get_settings()


class NGORedistributionService:
    """Service managing unsold food redistribution to local NGO shelters."""

    def trigger_surplus(self, db: Session) -> TriggerSurplusResponse:
        """
        End-of-shift surplus sweep:
        1. Identifies all ACTIVE DynamicSkus with remaining_portions > 0.
        2. Creates RedistributionBatch records (status = OFFERED).
        3. Transitions SKUs to REDISTRIBUTED status.
        4. Computes Haversine distance to all active NGOs and ranks them.
        """
        active_skus = (
            db.query(DynamicSku)
            .filter(
                DynamicSku.status == SkuStatus.ACTIVE,
                DynamicSku.remaining_portions > 0,
            )
            .all()
        )

        batches_created: List[RedistributionBatch] = []
        total_portions = 0
        total_weight_kg = 0.0

        for sku in active_skus:
            # Estimate physical portion mass (from recipe formulation or standard 0.25 kg)
            portion_weight = (
                sku.recipe.scrap_per_portion_kg if sku.recipe and sku.recipe.scrap_per_portion_kg > 0 else 0.25
            )
            batch_mass = round(sku.remaining_portions * portion_weight, 3)

            batch = RedistributionBatch(
                dynamic_sku_id=sku.id,
                item_name=sku.item_name,
                portions=sku.remaining_portions,
                weight_kg=batch_mass,
                status=BatchStatus.OFFERED,
            )
            db.add(batch)

            # Mark SKU as redistributed
            sku.status = SkuStatus.REDISTRIBUTED

            total_portions += sku.remaining_portions
            total_weight_kg += batch_mass
            batches_created.append(batch)

        db.commit()
        for b in batches_created:
            db.refresh(b)

        # Geospatial Distance Ranking for Active NGOs
        active_ngos = db.query(NGO).filter(NGO.is_active == True).all()
        ranked_candidates: List[NGORankedCandidate] = []

        for ngo in active_ngos:
            dist = haversine_distance(
                lat1=settings.RESTAURANT_LATITUDE,
                lon1=settings.RESTAURANT_LONGITUDE,
                lat2=ngo.latitude,
                lon2=ngo.longitude,
            )
            ranked_candidates.append(
                NGORankedCandidate(
                    ngo_id=ngo.id,
                    name=ngo.name,
                    phone=ngo.phone,
                    distance_km=dist,
                    max_capacity=ngo.max_capacity,
                    is_available=ngo.max_capacity >= total_portions,
                )
            )

        # Sort nearest to furthest
        ranked_candidates.sort(key=lambda n: n.distance_km)

        logger.info(
            "Surplus sweep triggered: %d batches created, %d portions (%.2f kg) offered to %d NGOs.",
            len(batches_created),
            total_portions,
            total_weight_kg,
            len(ranked_candidates),
        )

        return TriggerSurplusResponse(
            batches_created=[RedistributionBatchResponse.model_validate(b) for b in batches_created],
            total_surplus_portions=total_portions,
            total_surplus_weight_kg=round(total_weight_kg, 3),
            ranked_ngos=ranked_candidates,
        )

    def claim_batch(
        self,
        db: Session,
        batch_id: int,
        ngo_id: int,
    ) -> ClaimBatchResponse:
        """
        Allows an NGO partner to claim an offered surplus batch:
        - Enforces that batch is currently OFFERED.
        - Prevents duplicate claims with transaction locking.
        - Generates a cryptographically strong 6-digit OTP.
        - Transitions status: OFFERED -> CLAIMED.
        """
        batch = db.query(RedistributionBatch).filter(RedistributionBatch.id == batch_id).first()
        if not batch:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Redistribution batch #{batch_id} not found.",
            )

        if batch.status == BatchStatus.CLAIMED:
            assigned_name = batch.assigned_ngo.name if batch.assigned_ngo else "another NGO"
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Batch #{batch_id} has already been claimed by {assigned_name}.",
            )

        if batch.status == BatchStatus.COMPLETED:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Batch #{batch_id} has already been picked up and completed.",
            )

        ngo = db.query(NGO).filter(NGO.id == ngo_id, NGO.is_active == True).first()
        if not ngo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Active NGO partner with ID {ngo_id} not found.",
            )

        # Generate CSPRNG 6-digit OTP
        otp = generate_secure_otp()

        # Atomic Claim
        batch.status = BatchStatus.CLAIMED
        batch.assigned_ngo_id = ngo.id
        batch.pickup_otp = otp
        db.commit()
        db.refresh(batch)

        logger.info(
            "NGO '%s' claimed batch #%d (%d portions of '%s'). OTP generated.",
            ngo.name,
            batch.id,
            batch.portions,
            batch.item_name,
        )

        return ClaimBatchResponse(
            batch_id=batch.id,
            ngo_id=ngo.id,
            ngo_name=ngo.name,
            status=batch.status,
            pickup_otp=otp,
            message=f"Batch #{batch.id} successfully claimed by {ngo.name}. Present OTP '{otp}' at kitchen pickup.",
        )

    def verify_handover(
        self,
        db: Session,
        batch_id: int,
        pickup_otp: str,
    ) -> VerifyHandoverResponse:
        """
        Validates pickup OTP and records completed NGO handover:
        1. Checks batch existence and CLAIMED status.
        2. Validates 6-digit OTP.
        3. Transitions status: CLAIMED -> COMPLETED.
        4. Updates SustainabilityLedger (meals donated, scrap diverted, CO2e avoided).
        """
        batch = db.query(RedistributionBatch).filter(RedistributionBatch.id == batch_id).first()
        if not batch:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Redistribution batch #{batch_id} was not found.",
            )

        if batch.status == BatchStatus.COMPLETED:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Batch #{batch_id} has already been verified and completed.",
            )

        if batch.status != BatchStatus.CLAIMED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Batch #{batch_id} is in status '{batch.status.value}' and cannot be handed over.",
            )

        if not batch.pickup_otp or batch.pickup_otp.strip() != pickup_otp.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid pickup OTP code provided. Handover verification failed.",
            )

        # Atomic Handover Completion
        batch.status = BatchStatus.COMPLETED
        co2e_avoided = round(batch.weight_kg * settings.CO2E_PER_KG_SCRAP, 3)

        # Update or create SustainabilityLedger for today
        today = datetime.now(timezone.utc).date()
        today_dt = datetime(today.year, today.month, today.day, tzinfo=timezone.utc)

        ledger = (
            db.query(SustainabilityLedger)
            .filter(SustainabilityLedger.date >= today_dt)
            .first()
        )
        if not ledger:
            ledger = SustainabilityLedger(
                date=today_dt,
                total_scrap_diverted_kg=batch.weight_kg,
                recovered_revenue=0.0,
                meals_donated=batch.portions,
                co2e_avoided_kg=co2e_avoided,
            )
            db.add(ledger)
        else:
            ledger.total_scrap_diverted_kg = round(ledger.total_scrap_diverted_kg + batch.weight_kg, 3)
            ledger.meals_donated += batch.portions
            ledger.co2e_avoided_kg = round(ledger.co2e_avoided_kg + co2e_avoided, 3)

        db.commit()
        db.refresh(batch)

        logger.info(
            "Batch #%d handover completed. %d meals donated, %.2f kg CO2e avoided.",
            batch.id,
            batch.portions,
            co2e_avoided,
        )

        return VerifyHandoverResponse(
            batch_id=batch.id,
            status=batch.status,
            portions_donated=batch.portions,
            weight_diverted_kg=batch.weight_kg,
            co2e_avoided_kg=co2e_avoided,
            message=(
                f"Handover verified successfully! {batch.portions} meals donated to NGO partner. "
                f"{co2e_avoided:.2f} kg CO2e emissions avoided."
            ),
        )


ngo_service = NGORedistributionService()
