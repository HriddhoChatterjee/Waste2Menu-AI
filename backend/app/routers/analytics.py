"""
KitchenOS Sustainability & ESG Analytics API Router
===================================================
Endpoints for real-time ESG metrics, landfill scrap diversion KPIs, revenue recovery,
and meal redistribution impact dashboards.
"""

from __future__ import annotations

from typing import List
from fastapi import APIRouter

from app.dependencies import DBSession
from app.models import SustainabilityLedger
from app.schemas import SustainabilityDashboardResponse
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Sustainability & ESG Analytics"])


@router.get(
    "/dashboard",
    response_model=SustainabilityDashboardResponse,
    summary="Get real-time sustainability and ESG impact metrics",
    description=(
        "Returns executive dashboard metrics including total recovered revenue in ₹, "
        "scrap mass diverted from landfill (kg), meals redistributed, and CO2e emissions avoided (kg)."
    ),
)
async def get_sustainability_dashboard(
    db: DBSession,
) -> SustainabilityDashboardResponse:
    """Calculates and returns live sustainability KPIs."""
    return analytics_service.get_dashboard_metrics(db)


@router.get(
    "/history",
    summary="Get daily sustainability ledger history",
)
async def get_sustainability_history(
    db: DBSession,
) -> List[dict]:
    """Returns historical daily records from the SustainabilityLedger."""
    records = db.query(SustainabilityLedger).order_by(SustainabilityLedger.date.desc()).all()
    return [
        {
            "id": r.id,
            "date": r.date.isoformat(),
            "total_scrap_diverted_kg": r.total_scrap_diverted_kg,
            "recovered_revenue_inr": r.recovered_revenue,
            "meals_donated": r.meals_donated,
            "co2e_avoided_kg": r.co2e_avoided_kg,
        }
        for r in records
    ]
