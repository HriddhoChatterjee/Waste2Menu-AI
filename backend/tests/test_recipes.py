"""
Phase 3 Verification Tests
==========================
Tests for ILP solver, recipe feasibility cards, batch approvals, and FIFO scrap allocations.
"""

from fastapi.testclient import TestClient
from main import app
from app.database import SessionLocal, Base, engine
from app.models import ScrapLedger, ScrapStatus, DynamicSku, SkuStatus
from app.services.seeder import seed_initial_data


def test_phase3_suite():
    # 1. Reset and seed database
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_initial_data(db)

    client = TestClient(app)

    # 2. Test GET /api/v1/recipes/match-feasible
    res = client.get("/api/v1/recipes/match-feasible")
    assert res.status_code == 200
    cards = res.json()
    assert len(cards) >= 1
    for card in cards:
        assert card["calculated_portions"] >= 8
        assert card["gross_margin_percentage"] >= 85.0

    # 3. Test POST /api/v1/recipes/approve-batch
    approve_payload = {"recipe_id": 2, "portions": 10}  # Chicken Bone Broth (category=BONES, req=10*0.25=2.5kg)
    res = client.post("/api/v1/recipes/approve-batch", json=approve_payload)
    assert res.status_code == 201
    sku = res.json()
    assert sku["recipe_id"] == 2
    assert sku["total_portions"] == 10
    assert sku["remaining_portions"] == 10
    assert sku["status"] == "ACTIVE"

    # 4. Verify Scrap deduction and leftover retention in reservoir
    res = client.get("/api/v1/scrap/reservoir")
    assert res.status_code == 200
    bones_item = next(item for item in res.json()["reservoir"] if item["category"] == "BONES")
    assert abs(bones_item["total_weight_kg"] - 1.5) < 0.01

    # 5. Test 409 Conflict on scrap over-allocation
    over_batch = {"recipe_id": 2, "portions": 15}  # 15 * 0.25 = 3.75kg > 1.5kg available
    res = client.post("/api/v1/recipes/approve-batch", json=over_batch)
    assert res.status_code == 409

    # 6. Test 422/400 Validation on portions < 8
    under_batch = {"recipe_id": 2, "portions": 4}
    res = client.post("/api/v1/recipes/approve-batch", json=under_batch)
    assert res.status_code in [400, 422]
