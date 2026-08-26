"""
Sustainability & Analytics Dashboard Tests
==========================================
Tests for recovered revenue, scrap mass diverted, meals donated, and CO2e emission reductions.
"""

from fastapi.testclient import TestClient
from main import app
from app.database import SessionLocal, Base, engine
from app.services.seeder import seed_initial_data


def setup_function():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_initial_data(db)


def test_sustainability_dashboard_metrics():
    client = TestClient(app)

    # Initial state
    init_res = client.get("/api/v1/analytics/dashboard")
    assert init_res.status_code == 200
    init_data = init_res.json()
    assert "total_recovered_revenue_inr" in init_data
    assert "total_co2e_avoided_kg" in init_data

    # Approve batch and place an order to generate revenue
    approve_res = client.post("/api/v1/recipes/approve-batch", json={"recipe_id": 2, "portions": 10})
    assert approve_res.status_code == 201
    sku_id = approve_res.json()["id"]

    order_res = client.post("/api/v1/pos/order", json={"dynamic_sku_id": sku_id, "quantity": 4})
    assert order_res.status_code == 201

    # Check updated analytics dashboard
    dash_res = client.get("/api/v1/analytics/dashboard")
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["total_recovered_revenue_inr"] == 4 * 220.0  # Rs.880
    assert dash_data["total_scrap_diverted_kg"] > 0
    assert dash_data["total_co2e_avoided_kg"] > 0


def test_sustainability_history():
    client = TestClient(app)
    res = client.get("/api/v1/analytics/history")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
