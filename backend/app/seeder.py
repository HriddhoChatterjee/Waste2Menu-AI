"""
Database seeder — populates a fresh DB with realistic demo data.
Called once on application startup if tables are empty.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    DailySpecial,
    Ingredient,
    NGOPartner,
    Recipe,
    RecipeIngredient,
    ScrapLog,
    SpecialStatus,
    StationEnum,
)

logger = logging.getLogger(__name__)


INGREDIENTS_SEED = [
    # (name, unit, stock_g, cost_per_unit, station, is_allergen)
    ("Carrot",        "grams", 3500, 0.003, StationEnum.VEG_PREP,    False),
    ("Onion",         "grams", 4000, 0.002, StationEnum.VEG_PREP,    False),
    ("Tomato",        "grams", 3000, 0.005, StationEnum.VEG_PREP,    False),
    ("Potato",        "grams", 5000, 0.002, StationEnum.VEG_PREP,    False),
    ("Spinach",       "grams", 1200, 0.008, StationEnum.VEG_PREP,    False),
    ("Bell Pepper",   "grams", 1800, 0.010, StationEnum.VEG_PREP,    False),
    ("Chicken Breast","grams", 4500, 0.025, StationEnum.MEAT_FISH,   False),
    ("Salmon Fillet", "grams", 2000, 0.055, StationEnum.MEAT_FISH,   True),
    ("Beef Mince",    "grams", 3000, 0.030, StationEnum.MEAT_FISH,   False),
    ("Flour",         "grams", 6000, 0.001, StationEnum.BAKERY,      True),
    ("Butter",        "grams", 2000, 0.012, StationEnum.BAKERY,      True),
    ("Eggs",          "units",  120, 0.150, StationEnum.BAKERY,      True),
    ("Cream",         "ml",   2500, 0.008, StationEnum.COLD_LARDER,  True),
    ("Mozzarella",    "grams", 1500, 0.020, StationEnum.COLD_LARDER, True),
    ("Pasta",         "grams", 4000, 0.003, StationEnum.HOT_LINE,    True),
    ("Rice",          "grams", 5000, 0.002, StationEnum.HOT_LINE,    False),
    ("Olive Oil",     "ml",   1000, 0.015, StationEnum.HOT_LINE,     False),
    ("Garlic",        "grams",  500, 0.010, StationEnum.VEG_PREP,    False),
    ("Lemon",         "grams",  600, 0.008, StationEnum.COLD_LARDER, False),
    ("Mushroom",      "grams", 2000, 0.012, StationEnum.VEG_PREP,    False),
]

RECIPES_SEED = [
    {
        "name": "Carrot & Ginger Soup",
        "description": "Silky smooth soup made from prep scraps",
        "cuisine_tag": "European",
        "base_price": 8.50,
        "prep_time_min": 25,
        "is_vegetarian": True,
        "is_vegan": True,
        "ingredients": [("Carrot", 300), ("Onion", 150), ("Garlic", 20), ("Olive Oil", 30)],
    },
    {
        "name": "Garden Stir-Fry Special",
        "description": "Wok-tossed vegetables with sesame glaze",
        "cuisine_tag": "Asian",
        "base_price": 10.00,
        "prep_time_min": 15,
        "is_vegetarian": True,
        "is_vegan": False,
        "ingredients": [("Bell Pepper", 200), ("Mushroom", 150), ("Spinach", 100), ("Garlic", 15)],
    },
    {
        "name": "Salmon Pasta",
        "description": "Cream sauce pasta with salmon offcuts",
        "cuisine_tag": "Italian",
        "base_price": 14.00,
        "prep_time_min": 30,
        "is_vegetarian": False,
        "is_vegan": False,
        "ingredients": [("Salmon Fillet", 180), ("Pasta", 250), ("Cream", 100), ("Lemon", 40)],
    },
    {
        "name": "Rustic Beef Bolognese",
        "description": "Classic ragu with off-cut beef mince",
        "cuisine_tag": "Italian",
        "base_price": 12.50,
        "prep_time_min": 45,
        "is_vegetarian": False,
        "is_vegan": False,
        "ingredients": [("Beef Mince", 200), ("Tomato", 300), ("Onion", 100), ("Pasta", 250)],
    },
    {
        "name": "Spinach & Mozzarella Flatbread",
        "description": "Crispy flatbread with wilted spinach",
        "cuisine_tag": "Mediterranean",
        "base_price": 9.00,
        "prep_time_min": 20,
        "is_vegetarian": True,
        "is_vegan": False,
        "ingredients": [("Flour", 200), ("Spinach", 150), ("Mozzarella", 120), ("Olive Oil", 20)],
    },
    {
        "name": "Chicken Rice Bowl",
        "description": "Grilled chicken on fragrant rice",
        "cuisine_tag": "Asian",
        "base_price": 11.00,
        "prep_time_min": 25,
        "is_vegetarian": False,
        "is_vegan": False,
        "ingredients": [("Chicken Breast", 220), ("Rice", 200), ("Garlic", 15), ("Olive Oil", 15)],
    },
    {
        "name": "Potato & Spinach Curry",
        "description": "Vegan aloo palak with aromatic spices",
        "cuisine_tag": "Indian",
        "base_price": 9.50,
        "prep_time_min": 35,
        "is_vegetarian": True,
        "is_vegan": True,
        "ingredients": [("Potato", 300), ("Spinach", 200), ("Tomato", 150), ("Onion", 100)],
    },
]

NGO_PARTNERS_SEED = [
    {
        "name": "City Food Bank",
        "contact_person": "Maria Chen",
        "phone": "+44 7700 123456",
        "email": "pickup@cityfoodbank.org",
        "address": "12 Elm Street, Manchester, M1 2AB",
    },
    {
        "name": "Sunrise Shelter",
        "contact_person": "James Okafor",
        "phone": "+44 7701 654321",
        "email": "donations@sunriseshelter.co.uk",
        "address": "45 Oak Avenue, Manchester, M4 5PQ",
    },
    {
        "name": "Community Harvest Trust",
        "contact_person": "Priya Sharma",
        "phone": "+44 7702 987654",
        "email": "food@communityharvesttrust.org",
        "address": "8 Cedar Lane, Salford, M7 3NR",
    },
]


async def seed_database(session: AsyncSession) -> None:
    """Idempotent seeder — only runs if `ingredients` table is empty."""
    result = await session.execute(select(Ingredient).limit(1))
    if result.scalars().first() is not None:
        logger.info("Database already seeded — skipping.")
        return

    logger.info("Seeding database with demo data …")

    # 1. Ingredients
    ingredient_map: dict[str, Ingredient] = {}
    for name, unit, stock, cost, station, allergen in INGREDIENTS_SEED:
        ing = Ingredient(
            name=name,
            unit=unit,
            current_stock_g=float(stock),
            cost_per_unit=cost,
            station=station,
            is_allergen=allergen,
        )
        session.add(ing)
        ingredient_map[name] = ing

    await session.flush()  # assign IDs

    # 2. Recipes + RecipeIngredients
    for r_data in RECIPES_SEED:
        recipe = Recipe(
            name=r_data["name"],
            description=r_data["description"],
            cuisine_tag=r_data["cuisine_tag"],
            base_price=r_data["base_price"],
            prep_time_min=r_data["prep_time_min"],
            is_vegetarian=r_data["is_vegetarian"],
            is_vegan=r_data["is_vegan"],
        )
        session.add(recipe)
        await session.flush()

        for ing_name, qty in r_data["ingredients"]:
            if ing_name in ingredient_map:
                ri = RecipeIngredient(
                    recipe_id=recipe.id,
                    ingredient_id=ingredient_map[ing_name].id,
                    quantity_g=float(qty),
                )
                session.add(ri)

    # 3. Some sample scrap logs
    sample_scraps = [
        ("Carrot", StationEnum.VEG_PREP,    250, 18.5, 82.0, "chef_001"),
        ("Onion",  StationEnum.VEG_PREP,    180, 22.0, 74.5, "chef_001"),
        ("Salmon Fillet", StationEnum.MEAT_FISH, 120, 12.0, 91.0, "chef_002"),
        ("Chicken Breast", StationEnum.MEAT_FISH, 200, 15.5, 88.0, "chef_002"),
        ("Flour",  StationEnum.BAKERY,      300, 25.0, 70.0, "chef_003"),
        ("Spinach", StationEnum.VEG_PREP,   150, 30.0, 65.0, "chef_001"),
        ("Potato", StationEnum.VEG_PREP,    400, 20.0, 78.0, "chef_004"),
        ("Beef Mince", StationEnum.MEAT_FISH, 180, 10.0, 94.0, "chef_002"),
        # Anomalous entries
        ("Carrot", StationEnum.VEG_PREP,   1800, 75.0, 25.0, "chef_005"),
        ("Onion",  StationEnum.VEG_PREP,   2200, 80.0, 20.0, "chef_005"),
    ]
    for ing_name, station, qty, yield_loss, knife_eff, chef in sample_scraps:
        if ing_name in ingredient_map:
            scrap = ScrapLog(
                ingredient_id=ingredient_map[ing_name].id,
                station=station,
                quantity_scrapped_g=float(qty),
                yield_loss_pct=yield_loss,
                knife_efficiency_score=knife_eff,
                chef_id=chef,
                is_anomaly=(yield_loss > 60 or knife_eff < 30),
            )
            session.add(scrap)

    # 4. NGO Partners
    for ngo_data in NGO_PARTNERS_SEED:
        session.add(NGOPartner(**ngo_data))

    await session.commit()
    logger.info("✅ Database seeded successfully.")
