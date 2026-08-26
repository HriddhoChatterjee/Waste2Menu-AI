"""
NGO Redistribution & Fallback Tests
====================================
Tests for surplus sweeps, Haversine proximity ranking, atomic claiming with CSPRNG OTPs,
double-claim prevention, and physical handover verification.
"""

from fastapi.testclient import TestClient
from main import app
from app.database import SessionLocal, Base, engine
from app.models import BatchStatus, SkuStatus
from app.services.seeder import seed_initial_data


def setup_function():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_initial_data(db)


def test_ngo_fallback_lifecycle():
    client = TestClient(app)

    # 1. Create an active Dynamic SKU by approving a batch
    approve_res = client.post("/api/v1/recipes/approve-batch", json={"recipe_id": 1, "portions": 12})
    assert approve_res.status_code == 201

    # 2. Trigger surplus sweep
    surplus_res = client.post("/api/v1/fallback/trigger-surplus")
    assert surplus_res.status_code == 201
    surplus_data = surplus_res.json()
    assert surplus_data["total_surplus_portions"] == 12
    assert len(surplus_data["batches_created"]) == 1
    assert len(surplus_data["ranked_ngos"]) >= 1

    batch_id = surplus_data["batches_created"][0]["id"]
    nearest_ngo_id = surplus_data["ranked_ngos"][0]["ngo_id"]

    # Verify NGOs are ranked nearest-first
    distances = [n["distance_km"] for n in surplus_data["ranked_ngos"]]
    assert distances == sorted(distances)

    # 3. NGO claims the offered batch
    claim_res = client.post("/api/v1/fallback/claim", json={"batch_id": batch_id, "ngo_id": nearest_ngo_id})
    assert claim_res.status_code == 200
    claim_data = claim_res.json()
    assert claim_data["status"] == "CLAIMED"
    otp = claim_data["pickup_otp"]
    assert len(otp) == 6
    assert otp.isdigit()

    # 4. Double claim prevention (Another NGO attempts to claim the same batch)
    other_ngo_id = surplus_data["ranked_ngos"][1]["ngo_id"]
    double_claim_res = client.post("/api/v1/fallback/claim", json={"batch_id": batch_id, "ngo_id": other_ngo_id})
    assert double_claim_res.status_code == 409

    # 5. Handover verification with invalid OTP
    wrong_otp_res = client.post("/api/v1/fallback/verify-handover", json={"batch_id": batch_id, "pickup_otp": "000000"})
    assert wrong_otp_res.status_code == 400

    # 6. Handover verification with correct OTP
    handover_res = client.post("/api/v1/fallback/verify-handover", json={"batch_id": batch_id, "pickup_otp": otp})
    assert handover_res.status_code == 200
    handover_data = handover_res.json()
    assert handover_data["status"] == "COMPLETED"
    assert handover_data["portions_donated"] == 12
    assert handover_data["co2e_avoided_kg"] > 0

    # 7. Duplicate handover prevention
    dup_handover_res = client.post("/api/v1/fallback/verify-handover", json={"batch_id": batch_id, "pickup_otp": otp})
    assert dup_handover_res.status_code == 409
