"""
KitchenOS Database Seeder
=========================
Populates realistic initial ingredients, byproduct recipes, NGO shelter partners,
and historical scrap records when initializing a clean database.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session

from app.models import (
    ByproductRecipe,
    NGO,
    RawInventory,
    ScrapCategory,
    ScrapLedger,
    ScrapStatus,
)

logger = logging.getLogger("kitchenos.seeder")


def seed_initial_data(db: Session) -> None:
    """Seeds default demo data if the raw_inventory table is empty."""
    if db.query(RawInventory).first() is not None:
        logger.info("Database already contains data. Skipping initial seeding.")
        return

    logger.info("🌱 Seeding KitchenOS initial data (Ingredients, Recipes, NGOs, Historical Scrap)...")

    # 1. Raw Inventory Ingredients
    raw_items = [
        RawInventory(
            name="Chicken (Whole / Bone-in)",
            category="POULTRY",
            baseline_trim_ratio=0.25,
            stock_kg=65.0,
        ),
        RawInventory(
            name="Potato (Pahadi Russet)",
            category="VEGETABLES",
            baseline_trim_ratio=0.15,
            stock_kg=90.0,
        ),
        RawInventory(
            name="Carrot (Red Winter)",
            category="VEGETABLES",
            baseline_trim_ratio=0.18,
            stock_kg=70.0,
        ),
        RawInventory(
            name="Onion (Nasik Red)",
            category="VEGETABLES",
            baseline_trim_ratio=0.12,
            stock_kg=85.0,
        ),
        RawInventory(
            name="Tomato (Hybrid Roma)",
            category="VEGETABLES",
            baseline_trim_ratio=0.10,
            stock_kg=55.0,
        ),
        RawInventory(
            name="Lemon (Assam Kagzi)",
            category="CITRUS",
            baseline_trim_ratio=0.35,
            stock_kg=35.0,
        ),
        RawInventory(
            name="Coriander (Fresh Bunches)",
            category="HERBS",
            baseline_trim_ratio=0.30,
            stock_kg=25.0,
        ),
    ]
    db.add_all(raw_items)
    db.flush()

    # 2. Byproduct Reverse Recipes (Targeting > 85% Gross Margin)
    recipes = [
        ByproductRecipe(
            name="Crispy Potato Skin Chaat",
            primary_scrap_category=ScrapCategory.VEGETABLE_SKINS,
            scrap_per_portion_kg=0.15,
            pantry_cost_per_portion=15.0,
            suggested_price=180.0,
            description="Crispy seasoned potato and root vegetable peel crisps with tangy tamarind and mint chutney.",
        ),
        ByproductRecipe(
            name="Chicken Bone Broth Soup",
            primary_scrap_category=ScrapCategory.BONES,
            scrap_per_portion_kg=0.25,
            pantry_cost_per_portion=20.0,
            suggested_price=220.0,
            description="12-hour slow-simmered chicken bone marrow broth with roasted aromatics and fresh herbs.",
        ),
        ByproductRecipe(
            name="Herb Stem Chutney & Dip",
            primary_scrap_category=ScrapCategory.HERB_STEMS,
            scrap_per_portion_kg=0.08,
            pantry_cost_per_portion=10.0,
            suggested_price=140.0,
            description="Vibrant herb stem emulsion of coriander, mint, roasted green chillies, and mustard oil.",
        ),
        ByproductRecipe(
            name="Citrus Peel Infused Syrup & Glaze",
            primary_scrap_category=ScrapCategory.CITRUS,
            scrap_per_portion_kg=0.10,
            pantry_cost_per_portion=12.0,
            suggested_price=160.0,
            description="Candied lemon and citrus peel reduction for artisanal cocktails and dessert glazes.",
        ),
        ByproductRecipe(
            name="Vegetable Scrap Minestrone",
            primary_scrap_category=ScrapCategory.VEGETABLE_SKINS,
            scrap_per_portion_kg=0.20,
            pantry_cost_per_portion=18.0,
            suggested_price=190.0,
            description="Rich Italian broth loaded with caramelized carrot, potato, and onion trimmings.",
        ),
    ]
    db.add_all(recipes)
    db.flush()

    # 3. Verified NGO Shelter Partners (Coordinates around central kitchen: 28.6139, 77.2090)
    ngos = [
        NGO(
            name="Robin Hood Army - Delhi Central",
            phone="+91-9811001122",
            latitude=28.6250,
            longitude=77.2180,
            max_capacity=150,
            is_active=True,
        ),
        NGO(
            name="Feeding India Hunger Relief",
            phone="+91-9822334455",
            latitude=28.6380,
            longitude=77.2250,
            max_capacity=200,
            is_active=True,
        ),
        NGO(
            name="Uday Foundation Shelter Meals",
            phone="+91-9833445566",
            latitude=28.5800,
            longitude=77.2300,
            max_capacity=120,
            is_active=True,
        ),
        NGO(
            name="Goonj Community Kitchen",
            phone="+91-9844556677",
            latitude=28.5400,
            longitude=77.2600,
            max_capacity=180,
            is_active=True,
        ),
    ]
    db.add_all(ngos)
    db.flush()

    # 4. Historical & Available Scrap Records
    # Provides initial scrap reservoir for instant testing of recipe solver & POS
    now = datetime.now(timezone.utc)
    scraps = [
        # Vegetable skins available
        ScrapLedger(
            cook_id=101,
            raw_inventory_id=raw_items[1].id,  # Potato
            scrap_category=ScrapCategory.VEGETABLE_SKINS,
            usable_weight_kg=6.0,
            scrap_weight_kg=1.1,
            trim_ratio=round(1.1 / 7.1, 4),
            is_anomaly=False,
            status=ScrapStatus.AVAILABLE,
            logged_at=now - timedelta(hours=3),
        ),
        ScrapLedger(
            cook_id=102,
            raw_inventory_id=raw_items[2].id,  # Carrot
            scrap_category=ScrapCategory.VEGETABLE_SKINS,
            usable_weight_kg=5.0,
            scrap_weight_kg=1.2,
            trim_ratio=round(1.2 / 6.2, 4),
            is_anomaly=False,
            status=ScrapStatus.AVAILABLE,
            logged_at=now - timedelta(hours=2),
        ),
        # Bones available
        ScrapLedger(
            cook_id=101,
            raw_inventory_id=raw_items[0].id,  # Chicken
            scrap_category=ScrapCategory.BONES,
            usable_weight_kg=12.0,
            scrap_weight_kg=4.0,
            trim_ratio=round(4.0 / 16.0, 4),
            is_anomaly=False,
            status=ScrapStatus.AVAILABLE,
            logged_at=now - timedelta(hours=4),
        ),
        # Citrus available
        ScrapLedger(
            cook_id=103,
            raw_inventory_id=raw_items[5].id,  # Lemon
            scrap_category=ScrapCategory.CITRUS,
            usable_weight_kg=3.5,
            scrap_weight_kg=1.8,
            trim_ratio=round(1.8 / 5.3, 4),
            is_anomaly=False,
            status=ScrapStatus.AVAILABLE,
            logged_at=now - timedelta(hours=1),
        ),
        # Herb stems available
        ScrapLedger(
            cook_id=104,
            raw_inventory_id=raw_items[6].id,  # Coriander
            scrap_category=ScrapCategory.HERB_STEMS,
            usable_weight_kg=2.5,
            scrap_weight_kg=1.1,
            trim_ratio=round(1.1 / 3.6, 4),
            is_anomaly=False,
            status=ScrapStatus.AVAILABLE,
            logged_at=now - timedelta(minutes=45),
        ),
    ]
    db.add_all(scraps)
    db.commit()

    logger.info("✅ Database seeded successfully.")
