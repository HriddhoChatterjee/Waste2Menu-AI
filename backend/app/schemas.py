"""
KitchenOS Pydantic v2 Base & Domain Schemas
===========================================
Strictly typed data transfer objects with Pydantic v2 validation,
from_attributes=True configuration, and clear field constraints.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

from app.models import BatchStatus, ScrapCategory, ScrapStatus, SkuStatus


# ─────────────────────────────────────────────────────────────────────────────
# Raw Inventory Schemas
# ─────────────────────────────────────────────────────────────────────────────

class RawInventoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    category: str = Field(..., min_length=1, max_length=80)
    baseline_trim_ratio: float = Field(..., ge=0.0, le=1.0, description="Expected trim loss fraction (0.0 to 1.0)")
    stock_kg: float = Field(..., ge=0.0, description="Current usable stock in kg")


class RawInventoryCreate(RawInventoryBase):
    pass


class RawInventoryResponse(RawInventoryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ─────────────────────────────────────────────────────────────────────────────
# Scrap Ledger Schemas
# ─────────────────────────────────────────────────────────────────────────────

class ScrapLogCreate(BaseModel):
    cook_id: int = Field(..., gt=0, description="ID of the cook logging the prep event")
    raw_inventory_id: int = Field(..., gt=0, description="ID of the raw inventory item prepped")
    usable_weight_kg: float = Field(..., gt=0.0, description="Weight of usable product obtained (kg)")
    scrap_weight_kg: float = Field(..., gt=0.0, description="Weight of scraps generated (kg)")


class ScrapLogResponse(BaseModel):
    id: int
    cook_id: int
    raw_inventory_id: int
    scrap_category: ScrapCategory
    usable_weight_kg: float
    scrap_weight_kg: float
    trim_ratio: float
    is_anomaly: bool
    status: ScrapStatus
    logged_at: datetime
    raw_inventory: Optional[RawInventoryResponse] = None

    model_config = ConfigDict(from_attributes=True)


class ReservoirItem(BaseModel):
    category: ScrapCategory
    total_weight_kg: float = Field(..., ge=0.0)


class ReservoirResponse(BaseModel):
    reservoir: List[ReservoirItem]
    total_available_kg: float = Field(..., ge=0.0)


# ─────────────────────────────────────────────────────────────────────────────
# Byproduct Recipe & Solver Schemas
# ─────────────────────────────────────────────────────────────────────────────

class ByproductRecipeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    primary_scrap_category: ScrapCategory
    scrap_per_portion_kg: float = Field(..., gt=0.0)
    pantry_cost_per_portion: float = Field(default=0.0, ge=0.0)
    suggested_price: float = Field(..., gt=0.0)
    description: str = Field(default="")


class ByproductRecipeCreate(ByproductRecipeBase):
    pass


class ByproductRecipeResponse(ByproductRecipeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class FeasibleRecipeCard(BaseModel):
    recipe_id: int
    name: str
    primary_scrap_category: ScrapCategory
    scrap_per_portion_kg: float
    suggested_price: float
    pantry_cost_per_portion: float
    available_scrap_kg: float
    calculated_portions: int = Field(..., ge=8)
    expected_revenue: float
    expected_pantry_cost: float
    expected_gross_profit: float
    gross_margin_percentage: float = Field(..., ge=85.0)
    description: str


class ApproveBatchRequest(BaseModel):
    recipe_id: int = Field(..., gt=0)
    portions: int = Field(..., ge=8, description="Portions to approve (must be >= 8)")


# ─────────────────────────────────────────────────────────────────────────────
# Dynamic SKU & POS Schemas
# ─────────────────────────────────────────────────────────────────────────────

class DynamicSkuResponse(BaseModel):
    id: int
    recipe_id: int
    item_name: str
    total_portions: int
    remaining_portions: int
    unit_price: float
    status: SkuStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LiveMenuItemResponse(BaseModel):
    sku_id: int
    item_name: str
    total_portions: int
    remaining_portions: int
    unit_price: float
    status: SkuStatus
    badge: str
    recipe_description: str


class OrderCreate(BaseModel):
    dynamic_sku_id: int = Field(..., gt=0)
    quantity: int = Field(..., gt=0, description="Quantity of portions to purchase")


class OrderResponse(BaseModel):
    id: int
    dynamic_sku_id: int
    quantity: int
    total_price: float
    ordered_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BillingSummaryResponse(BaseModel):
    order_id: int
    item_name: str
    quantity: int
    unit_price: float
    total_price: float
    remaining_sku_portions: int
    sku_status: SkuStatus
    ordered_at: datetime


# ─────────────────────────────────────────────────────────────────────────────
# NGO & Redistribution Schemas
# ─────────────────────────────────────────────────────────────────────────────

class NGOBatchCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    phone: str = Field(..., min_length=5, max_length=30)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    max_capacity: int = Field(default=100, gt=0)
    is_active: bool = True


class NGOResponse(NGOBatchCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


class NGORankedCandidate(BaseModel):
    ngo_id: int
    name: str
    phone: str
    distance_km: float
    max_capacity: int
    is_available: bool


class RedistributionBatchResponse(BaseModel):
    id: int
    dynamic_sku_id: int
    item_name: str
    portions: int
    weight_kg: float
    status: BatchStatus
    assigned_ngo_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TriggerSurplusResponse(BaseModel):
    batches_created: List[RedistributionBatchResponse]
    total_surplus_portions: int
    total_surplus_weight_kg: float
    ranked_ngos: List[NGORankedCandidate]


class ClaimBatchRequest(BaseModel):
    batch_id: int = Field(..., gt=0)
    ngo_id: int = Field(..., gt=0)


class ClaimBatchResponse(BaseModel):
    batch_id: int
    ngo_id: int
    ngo_name: str
    status: BatchStatus
    pickup_otp: str
    message: str


class VerifyHandoverRequest(BaseModel):
    batch_id: int = Field(..., gt=0)
    pickup_otp: str = Field(..., min_length=6, max_length=6)


class VerifyHandoverResponse(BaseModel):
    batch_id: int
    status: BatchStatus
    portions_donated: int
    weight_diverted_kg: float
    co2e_avoided_kg: float
    message: str


# ─────────────────────────────────────────────────────────────────────────────
# Sustainability & Analytics Schemas
# ─────────────────────────────────────────────────────────────────────────────

class SustainabilityDashboardResponse(BaseModel):
    total_recovered_revenue_inr: float = Field(..., description="Total recovered revenue in ₹")
    total_scrap_diverted_kg: float = Field(..., description="Total scrap diverted from landfill (kg)")
    total_meals_redistributed: int = Field(..., description="Total unsold & donated meals distributed")
    total_co2e_avoided_kg: float = Field(..., description="Total GHG / CO2e avoided (kg)")
    active_specials_count: int
    active_ngos_count: int
    total_scrap_logged_kg: float
