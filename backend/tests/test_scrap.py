"""
Scrap Ingestion & Reservoir Tests
=================================
Tests for scrap logging, trim ratio calculation, isolation forest anomaly detection,
inventory decrements, and reservoir aggregation.
"""

from fastapi.testclient import TestClient
from main import app
from app.database import SessionLocal, Base, engine
from app.models import RawInventory, ScrapLedger, ScrapStatus
from app.services.seeder import seed_initial_data


def setup_function():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_initial_data(db)


def test_get_scrap_reservoir():
    client = TestClient(app)
    res = client.get("/api/v1/scrap/reservoir")
    assert res.status_code == 200
    data = res.json()
    assert "reservoir" in data
    assert data["total_available_kg"] > 0
    categories = [r["category"] for r in data["reservoir"]]
    assert "BONES" in categories
    assert "VEGETABLE_SKINS" in categories


def test_log_scrap_inlier():
    client = TestClient(app)
    # Carrot (baseline 0.18): 5kg usable, 0.9kg scrap -> ratio ~0.1525 (inlier)
    payload = {
        "cook_id": 1,
        "raw_inventory_id": 3,
        "usable_weight_kg": 5.0,
        "scrap_weight_kg": 0.9,
    }
    res = client.post("/api/v1/scrap/log", json=payload)
    assert res.status_code == 201
    entry = res.json()
    assert entry["is_anomaly"] is False
    assert entry["status"] == "AVAILABLE"
    assert entry["scrap_category"] == "VEGETABLE_SKINS"


def test_log_scrap_anomaly():
    client = TestClient(app)
    # Carrot (baseline 0.18): 3kg usable, 3kg scrap -> ratio 0.50 (severe anomaly)
    payload = {
        "cook_id": 2,
        "raw_inventory_id": 3,
        "usable_weight_kg": 3.0,
        "scrap_weight_kg": 3.0,
    }
    res = client.post("/api/v1/scrap/log", json=payload)
    assert res.status_code == 201
    entry = res.json()
    assert entry["is_anomaly"] is True


def test_log_scrap_insufficient_stock():
    client = TestClient(app)
    payload = {
        "cook_id": 1,
        "raw_inventory_id": 3,
        "usable_weight_kg": 500.0,
        "scrap_weight_kg": 50.0,
    }
    res = client.post("/api/v1/scrap/log", json=payload)
    assert res.status_code == 400


def test_log_scrap_invalid_weights():
    client = TestClient(app)
    payload = {
        "cook_id": 1,
        "raw_inventory_id": 3,
        "usable_weight_kg": -2.0,
        "scrap_weight_kg": 0.5,
    }
    res = client.post("/api/v1/scrap/log", json=payload)
    assert res.status_code == 422
