"""
KitchenOS Sustainability & ESG Analytics Service
================================================
Calculates real-time financial recovery, scrap diversion metrics, meal redistribution totals,
and greenhouse gas (GHG/CO2e) avoidance figures.
"""

from __future__ import annotations

import logging
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models import (
    BatchStatus,
    DynamicSku,
    NGO,
    Order,
    RedistributionBatch,
    ScrapLedger,
    ScrapStatus,
    SkuStatus,
    SustainabilityLedger,
)
from app.schemas import SustainabilityDashboardResponse

logger = logging.getLogger("kitchenos.analytics")
settings = get_settings()


class SustainabilityAnalyticsService:
    """Computes kitchen environmental, social, and economic sustainability KPIs."""

    def get_dashboard_metrics(self, db: Session) -> SustainabilityDashboardResponse:
        """
        Aggregates live dashboard KPIs:
        1. Recovered Revenue (₹): Sum of all POS orders placed for byproduct specials.
        2. Total Scrap Diverted (kg): Total scrap consumed in approved batches and completed NGO donations.
        3. Total Meals Redistributed: Total portions handed over to NGO shelters.
        4. Total CO2e Avoided (kg): Scrap Diverted (kg) * 2.5 kg CO2e/kg.
        5. Active counts (specials, NGOs, scrap logged).
        """
        # 1. Recovered Revenue
        revenue_sum = db.query(func.sum(Order.total_price)).scalar()
        total_recovered_revenue = round(float(revenue_sum or 0.0), 2)

        # 2. Total Scrap Logged
        total_scrap_logged = round(
            float(db.query(func.sum(ScrapLedger.scrap_weight_kg)).scalar() or 0.0), 3
        )

        # 3. Total Scrap Diverted into Menu Specials or Direct NGO Batches
        # Scrap in allocated/sold DynamicSkus
        skus = db.query(DynamicSku).all()
        scrap_diverted_via_specials = 0.0
        for s in skus:
            if s.recipe and s.recipe.scrap_per_portion_kg > 0:
                scrap_diverted_via_specials += s.total_portions * s.recipe.scrap_per_portion_kg

        # Meals donated via NGO handovers
        completed_batches = (
            db.query(RedistributionBatch)
            .filter(RedistributionBatch.status == BatchStatus.COMPLETED)
            .all()
        )
        total_meals_donated = sum(b.portions for b in completed_batches)

        # Historical ledger aggregations
        ledger_diverted = db.query(func.sum(SustainabilityLedger.total_scrap_diverted_kg)).scalar()
        ledger_meals = db.query(func.sum(SustainabilityLedger.meals_donated)).scalar()

        total_scrap_diverted = round(max(scrap_diverted_via_specials, float(ledger_diverted or 0.0)), 3)
        total_meals_redistributed = max(total_meals_donated, int(ledger_meals or 0))

        # 4. Total CO2e Avoided (kg) = Diverted scrap mass * 2.5
        total_co2e_avoided = round(total_scrap_diverted * settings.CO2E_PER_KG_SCRAP, 3)

        # 5. Operational Counts
        active_specials_count = (
            db.query(DynamicSku).filter(DynamicSku.status == SkuStatus.ACTIVE).count()
        )
        active_ngos_count = db.query(NGO).filter(NGO.is_active == True).count()

        return SustainabilityDashboardResponse(
            total_recovered_revenue_inr=total_recovered_revenue,
            total_scrap_diverted_kg=total_scrap_diverted,
            total_meals_redistributed=total_meals_redistributed,
            total_co2e_avoided_kg=total_co2e_avoided,
            active_specials_count=active_specials_count,
            active_ngos_count=active_ngos_count,
            total_scrap_logged_kg=total_scrap_logged,
        )


analytics_service = SustainabilityAnalyticsService()
