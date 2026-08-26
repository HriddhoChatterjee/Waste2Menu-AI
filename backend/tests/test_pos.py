"""
Phase 4 POS Verification Tests
==============================
Tests for live menu retrieval, atomic order stock decrements, SOLD_OUT transitions,
and concurrency conflict protections.
"""

from fastapi.testclient import TestClient
from main import app
from app.database import SessionLocal, Base, engine
from app.models import DynamicSku, SkuStatus
from app.services.seeder import seed_initial_data


def test_pos_suite():
    # 1. Reset and seed database
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_initial_data(db)

    client = TestClient(app)

    # 2. Approve a recipe batch first (10 portions of Chicken Bone Broth)
    approve_res = client.post("/api/v1/recipes/approve-batch", json={"recipe_id": 2, "portions": 10})
    assert approve_res.status_code == 201
    sku_id = approve_res.json()["id"]

    # 3. Test GET /api/v1/pos/live-menu
    menu_res = client.get("/api/v1/pos/live-menu")
    assert menu_res.status_code == 200
    menu = menu_res.json()
    assert len(menu) >= 1
    item = next(m for m in menu if m["sku_id"] == sku_id)
    assert item["item_name"] == "Chicken Bone Broth Soup"
    assert item["remaining_portions"] == 10
    assert item["status"] == "ACTIVE"

    # 4. Test POST /api/v1/pos/order (Partial order: 3 portions)
    order_res = client.post("/api/v1/pos/order", json={"dynamic_sku_id": sku_id, "quantity": 3})
    assert order_res.status_code == 201
    bill = order_res.json()
    assert bill["quantity"] == 3
    assert bill["unit_price"] == 220.0
    assert bill["total_price"] == 660.0
    assert bill["remaining_sku_portions"] == 7
    assert bill["sku_status"] == "ACTIVE"

    # 5. Order remaining 7 portions -> Should trigger SOLD_OUT transition
    final_order_res = client.post("/api/v1/pos/order", json={"dynamic_sku_id": sku_id, "quantity": 7})
    assert final_order_res.status_code == 201
    final_bill = final_order_res.json()
    assert final_bill["remaining_sku_portions"] == 0
    assert final_bill["sku_status"] == "SOLD_OUT"

    # Check live menu now marks it SOLD OUT
    menu_after = client.get("/api/v1/pos/live-menu").json()
    sold_out_item = next(m for m in menu_after if m["sku_id"] == sku_id)
    assert sold_out_item["status"] == "SOLD_OUT"
    assert sold_out_item["badge"] == "SOLD OUT"

    # 6. Test 409 Conflict when attempting to order from SOLD_OUT SKU
    post_sold_out_res = client.post("/api/v1/pos/order", json={"dynamic_sku_id": sku_id, "quantity": 1})
    assert post_sold_out_res.status_code == 409

    # 7. Test 404 for non-existent SKU
    missing_sku_res = client.post("/api/v1/pos/order", json={"dynamic_sku_id": 99999, "quantity": 1})
    assert missing_sku_res.status_code == 404

    # 8. Test 400/422 for invalid non-positive quantities
    invalid_qty_res = client.post("/api/v1/pos/order", json={"dynamic_sku_id": sku_id, "quantity": 0})
    assert invalid_qty_res.status_code in [400, 422]
