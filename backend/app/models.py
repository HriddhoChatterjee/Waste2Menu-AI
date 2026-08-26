"""
KitchenOS SQLAlchemy 2.0 ORM Models
===================================
Database schema for KitchenOS scrap-to-menu tracking, recipe formulation,
POS sales, NGO redistribution, and ESG sustainability metrics.
"""

from __future__ import annotations

import enum
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


# ─────────────────────────────────────────────────────────────────────────────
# Enums
# ─────────────────────────────────────────────────────────────────────────────

class ScrapCategory(str, enum.Enum):
    BONES = "BONES"
    VEGETABLE_SKINS = "VEGETABLE_SKINS"
    CITRUS = "CITRUS"
    HERB_STEMS = "HERB_STEMS"


class ScrapStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    ALLOCATED = "ALLOCATED"
    DISCARDED = "DISCARDED"


class SkuStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    SOLD_OUT = "SOLD_OUT"
    REDISTRIBUTED = "REDISTRIBUTED"


class BatchStatus(str, enum.Enum):
    OFFERED = "OFFERED"
    CLAIMED = "CLAIMED"
    COMPLETED = "COMPLETED"
    EXPIRED = "EXPIRED"


# ─────────────────────────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────────────────────────

class RawInventory(Base):
    """Raw ingredients tracked in the kitchen inventory."""
    __tablename__ = "raw_inventory"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    baseline_trim_ratio: Mapped[float] = mapped_column(Float, nullable=False, default=0.15)
    stock_kg: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    # Relationships
    scrap_logs: Mapped[List[ScrapLedger]] = relationship("ScrapLedger", back_populates="raw_inventory")

    __table_args__ = (
        CheckConstraint("baseline_trim_ratio >= 0.0 AND baseline_trim_ratio <= 1.0", name="chk_baseline_trim_ratio_range"),
        CheckConstraint("stock_kg >= 0.0", name="chk_raw_inventory_stock_positive"),
    )


class ScrapLedger(Base):
    """Immutable/Auditable record of prep-scrap generation events."""
    __tablename__ = "scrap_ledger"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    cook_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    raw_inventory_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("raw_inventory.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    scrap_category: Mapped[ScrapCategory] = mapped_column(
        Enum(ScrapCategory, native_enum=False, length=30), nullable=False, index=True
    )
    usable_weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    scrap_weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    trim_ratio: Mapped[float] = mapped_column(Float, nullable=False)
    is_anomaly: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    status: Mapped[ScrapStatus] = mapped_column(
        Enum(ScrapStatus, native_enum=False, length=20), nullable=False, default=ScrapStatus.AVAILABLE, index=True
    )
    logged_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), index=True
    )

    # Relationships
    raw_inventory: Mapped[RawInventory] = relationship("RawInventory", back_populates="scrap_logs")

    __table_args__ = (
        CheckConstraint("usable_weight_kg > 0.0", name="chk_usable_weight_positive"),
        CheckConstraint("scrap_weight_kg > 0.0", name="chk_scrap_weight_positive"),
        CheckConstraint("trim_ratio >= 0.0 AND trim_ratio <= 1.0", name="chk_trim_ratio_range"),
        Index("idx_scrap_category_status", "scrap_category", "status"),
    )


class ByproductRecipe(Base):
    """Formulations converting raw scraps into revenue-generating menu items."""
    __tablename__ = "byproduct_recipes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True, index=True)
    primary_scrap_category: Mapped[ScrapCategory] = mapped_column(
        Enum(ScrapCategory, native_enum=False, length=30), nullable=False, index=True
    )
    scrap_per_portion_kg: Mapped[float] = mapped_column(Float, nullable=False)
    pantry_cost_per_portion: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    suggested_price: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")

    # Relationships
    skus: Mapped[List[DynamicSku]] = relationship("DynamicSku", back_populates="recipe")

    __table_args__ = (
        CheckConstraint("scrap_per_portion_kg > 0.0", name="chk_scrap_per_portion_positive"),
        CheckConstraint("suggested_price > 0.0", name="chk_suggested_price_positive"),
        CheckConstraint("pantry_cost_per_portion >= 0.0", name="chk_pantry_cost_non_negative"),
    )


class DynamicSku(Base):
    """Dynamic POS items created upon approving an optimized batch from scrap."""
    __tablename__ = "dynamic_skus"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    recipe_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("byproduct_recipes.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    item_name: Mapped[str] = mapped_column(String(200), nullable=False)
    total_portions: Mapped[int] = mapped_column(Integer, nullable=False)
    remaining_portions: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[SkuStatus] = mapped_column(
        Enum(SkuStatus, native_enum=False, length=20), nullable=False, default=SkuStatus.ACTIVE, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), index=True
    )

    # Relationships
    recipe: Mapped[ByproductRecipe] = relationship("ByproductRecipe", back_populates="skus")
    orders: Mapped[List[Order]] = relationship("Order", back_populates="dynamic_sku")
    redistribution_batches: Mapped[List[RedistributionBatch]] = relationship(
        "RedistributionBatch", back_populates="dynamic_sku"
    )

    __table_args__ = (
        CheckConstraint("total_portions > 0", name="chk_total_portions_positive"),
        CheckConstraint("remaining_portions >= 0", name="chk_remaining_portions_non_negative"),
        CheckConstraint("remaining_portions <= total_portions", name="chk_remaining_lte_total"),
        CheckConstraint("unit_price >= 0.0", name="chk_unit_price_non_negative"),
    )


class Order(Base):
    """POS orders placed for active DynamicSku daily specials."""
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    dynamic_sku_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("dynamic_skus.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    total_price: Mapped[float] = mapped_column(Float, nullable=False)
    ordered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), index=True
    )

    # Relationships
    dynamic_sku: Mapped[DynamicSku] = relationship("DynamicSku", back_populates="orders")

    __table_args__ = (
        CheckConstraint("quantity > 0", name="chk_order_quantity_positive"),
        CheckConstraint("total_price >= 0.0", name="chk_order_total_price_non_negative"),
    )


class NGO(Base):
    """Verified NGO shelter and food bank partners."""
    __tablename__ = "ngos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    max_capacity: Mapped[int] = mapped_column(Integer, nullable=False, default=100)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, index=True)

    # Relationships
    dispatches: Mapped[List[RedistributionBatch]] = relationship("RedistributionBatch", back_populates="assigned_ngo")

    __table_args__ = (
        CheckConstraint("latitude >= -90.0 AND latitude <= 90.0", name="chk_ngo_latitude_range"),
        CheckConstraint("longitude >= -180.0 AND longitude <= 180.0", name="chk_ngo_longitude_range"),
        CheckConstraint("max_capacity > 0", name="chk_ngo_capacity_positive"),
    )


class RedistributionBatch(Base):
    """End-of-shift unsold special batches routed to local NGOs."""
    __tablename__ = "redistribution_batches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    dynamic_sku_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("dynamic_skus.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    item_name: Mapped[str] = mapped_column(String(200), nullable=False)
    portions: Mapped[int] = mapped_column(Integer, nullable=False)
    weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[BatchStatus] = mapped_column(
        Enum(BatchStatus, native_enum=False, length=20), nullable=False, default=BatchStatus.OFFERED, index=True
    )
    pickup_otp: Mapped[Optional[str]] = mapped_column(String(6), nullable=True, index=True)
    assigned_ngo_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("ngos.id", ondelete="SET NULL"), nullable=True, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), index=True
    )

    # Relationships
    dynamic_sku: Mapped[DynamicSku] = relationship("DynamicSku", back_populates="redistribution_batches")
    assigned_ngo: Mapped[Optional[NGO]] = relationship("NGO", back_populates="dispatches")

    __table_args__ = (
        CheckConstraint("portions > 0", name="chk_batch_portions_positive"),
        CheckConstraint("weight_kg > 0.0", name="chk_batch_weight_positive"),
    )


class SustainabilityLedger(Base):
    """Daily aggregated environmental, social, and economic sustainability impact."""
    __tablename__ = "sustainability_ledger"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), unique=True, index=True
    )
    total_scrap_diverted_kg: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    recovered_revenue: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    meals_donated: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    co2e_avoided_kg: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
