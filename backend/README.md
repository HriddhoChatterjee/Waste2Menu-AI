# KitchenOS — Automated Kitchen Prep-Scrap Tracking & Dynamic Daily Special Menu Generation System

> **Enterprise Production Backend**: Turn food prep scraps into high-margin daily specials via Integer Linear Programming (ILP) with automatic NGO redistribution fallback.

---

## System Architecture

```text
kitchenos-backend/
├── main.py                     # FastAPI application entry point & lifecycle hooks
├── requirements.txt            # Production Python dependencies
├── .env.example                # Environment configuration template
├── README.md                   # Complete architectural & operational guide
│
├── app/
│   ├── config.py               # Pydantic BaseSettings (Database, CORS, Coordinates)
│   ├── database.py             # SQLAlchemy 2.0 engine & transactional session factory
│   ├── models.py               # 8 relational ORM domain models with check constraints
│   ├── schemas.py              # Pydantic v2 DTOs, request/response models & validation
│   ├── dependencies.py         # FastAPI dependency injection aliases
│   │
│   ├── routers/
│   │   ├── scrap.py            # Scrap logging, anomaly scoring & reservoir aggregation
│   │   ├── recipes.py          # PuLP ILP solver & atomic batch approvals
│   │   ├── pos.py              # Live menu, atomic order processing & SOLD_OUT transitions
│   │   ├── fallback.py         # Surplus sweeps, Haversine NGO ranking & OTP verification
│   │   └── analytics.py        # Sustainability KPIs, CO2e avoidance & financial metrics
│   │
│   ├── services/
│   │   ├── anomaly_detection.py # Isolation Forest + baseline fallback anomaly detector
│   │   ├── recipe_solver.py    # PuLP Integer Linear Programming (ILP) optimizer
│   │   ├── inventory_service.py # POS SKU inventory decrement & state manager
│   │   ├── ngo_service.py      # NGO shelter routing, CSPRNG OTP claims & handovers
│   │   ├── analytics_service.py # ESG & revenue recovery aggregator
│   │   └── seeder.py           # Clean database boot seeder
│   │
│   └── utils/
│       ├── geo.py              # Great-circle Haversine formula
│       └── security.py         # Cryptographically secure 6-digit OTP generator
│
└── tests/
    ├── test_scrap.py           # Scrap ingestion & anomaly detection unit tests
    ├── test_recipes.py         # ILP solver & batch approval tests
    ├── test_pos.py             # Live menu, ordering & sold-out transition tests
    ├── test_fallback.py        # NGO claims, double-claim guard & OTP handover tests
    └── test_analytics.py       # ESG dashboard & history tests
```

---

## Key Mathematical & Algorithmic Engines

### 1. Yield Loss & Knife Inefficiency Anomaly Detection (`app/services/anomaly_detection.py`)
Uses `scikit-learn`'s `IsolationForest` to analyze prep scrap feature vectors:
$$\vec{x} = [\text{trim\_ratio},\, \text{baseline\_trim\_ratio},\, \Delta_{\text{baseline}},\, \text{usable\_weight\_kg},\, \text{scrap\_weight\_kg}]$$
* **Trim Ratio Calculation**: $\text{trim\_ratio} = \frac{\text{scrap\_weight\_kg}}{\text{usable\_weight\_kg} + \text{scrap\_weight\_kg}}$
* **Deterministic Fallback**: Active when historical observations $< 10$, flagging yield deviations exceeding $+40\%$ over baseline standard.

### 2. Reverse Byproduct Recipe Optimization (`app/services/recipe_solver.py`)
Formulates and solves a global Integer Linear Program (ILP) using `PuLP`:
$$\text{Maximize: } Z = \sum_{i \in \text{Recipes}} \text{suggested\_price}_i \cdot x_i$$
$$\text{Subject to: } \sum_{i \in \text{Category}} \text{scrap\_per\_portion}_i \cdot x_i \le \text{Reservoir}_{\text{Category}}$$
$$x_i \ge 8 \cdot y_i, \quad x_i \le M \cdot y_i, \quad y_i \in \{0, 1\}, \quad x_i \in \mathbb{Z}_{\ge 0}$$
$$\text{Gross Margin } \% = \frac{\text{Gross Profit}_i}{\text{Gross Revenue}_i} \times 100 \ge 85.0\%$$

### 3. NGO Proximity Routing & Secure Handover (`app/services/ngo_service.py`)
* **Haversine Distance**: Computes great-circle distance between the kitchen coordinates $(28.6139, 77.2090)$ and verified local NGO shelters:
  $$d = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta\text{lon}}{2}\right)}\right)$$
* **Cryptographic OTP Generation**: Uses Python's `secrets` module (`CSPRNG`) for 6-digit numeric claim verification codes.
* **Avoided Emissions**: $\text{CO}_2\text{e Avoided (kg)} = \text{Diverted Scrap Mass (kg)} \times 2.5\text{ kg CO}_2\text{e}/\text{kg}$.

---

## Getting Started

### 1. Environment Setup

```bash
# Create and activate virtual environment
python -m venv .venv

# Windows:
.venv\Scripts\activate
# Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Run the Development Server

```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

* **API Root**: `http://127.0.0.1:8000/`
* **Interactive Swagger UI Docs**: `http://127.0.0.1:8000/docs`
* **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`

### 3. Run Automated Tests

```bash
pytest tests/ -v
```

---

## API Documentation & Example Requests

### Module A — Scrap Ingestion

#### `POST /api/v1/scrap/log`
```bash
curl -X POST http://127.0.0.1:8000/api/v1/scrap/log \
  -H "Content-Type: application/json" \
  -d '{
    "cook_id": 101,
    "raw_inventory_id": 2,
    "usable_weight_kg": 5.0,
    "scrap_weight_kg": 0.8
  }'
```
**Response (201 Created):**
```json
{
  "id": 8,
  "cook_id": 101,
  "raw_inventory_id": 2,
  "scrap_category": "VEGETABLE_SKINS",
  "usable_weight_kg": 5.0,
  "scrap_weight_kg": 0.8,
  "trim_ratio": 0.1379,
  "is_anomaly": false,
  "status": "AVAILABLE",
  "logged_at": "2026-08-26T00:00:00Z"
}
```

#### `GET /api/v1/scrap/reservoir`
```bash
curl http://127.0.0.1:8000/api/v1/scrap/reservoir
```

---

### Module B — Reverse Recipe Solver

#### `GET /api/v1/recipes/match-feasible`
```bash
curl http://127.0.0.1:8000/api/v1/recipes/match-feasible
```
**Response (200 OK):**
```json
[
  {
    "recipe_id": 1,
    "name": "Crispy Potato Skin Chaat",
    "primary_scrap_category": "VEGETABLE_SKINS",
    "scrap_per_portion_kg": 0.15,
    "suggested_price": 180.0,
    "pantry_cost_per_portion": 15.0,
    "available_scrap_kg": 3.1,
    "calculated_portions": 20,
    "expected_revenue": 3600.0,
    "expected_pantry_cost": 300.0,
    "expected_gross_profit": 3300.0,
    "gross_margin_percentage": 91.67,
    "description": "Crispy seasoned potato and root vegetable peel crisps..."
  }
]
```

#### `POST /api/v1/recipes/approve-batch`
```bash
curl -X POST http://127.0.0.1:8000/api/v1/recipes/approve-batch \
  -H "Content-Type: application/json" \
  -d '{
    "recipe_id": 1,
    "portions": 15
  }'
```

---

### Module C — Point of Sale (POS)

#### `GET /api/v1/pos/live-menu`
```bash
curl http://127.0.0.1:8000/api/v1/pos/live-menu
```

#### `POST /api/v1/pos/order`
```bash
curl -X POST http://127.0.0.1:8000/api/v1/pos/order \
  -H "Content-Type: application/json" \
  -d '{
    "dynamic_sku_id": 1,
    "quantity": 3
  }'
```
**Response (201 Created):**
```json
{
  "order_id": 1,
  "item_name": "Crispy Potato Skin Chaat",
  "quantity": 3,
  "unit_price": 180.0,
  "total_price": 540.0,
  "remaining_sku_portions": 12,
  "sku_status": "ACTIVE",
  "ordered_at": "2026-08-26T00:00:00Z"
}
```

---

### Module D — NGO Redistribution Fallback

#### `POST /api/v1/fallback/trigger-surplus`
```bash
curl -X POST http://127.0.0.1:8000/api/v1/fallback/trigger-surplus
```

#### `POST /api/v1/fallback/claim`
```bash
curl -X POST http://127.0.0.1:8000/api/v1/fallback/claim \
  -H "Content-Type: application/json" \
  -d '{
    "batch_id": 1,
    "ngo_id": 1
  }'
```

#### `POST /api/v1/fallback/verify-handover`
```bash
curl -X POST http://127.0.0.1:8000/api/v1/fallback/verify-handover \
  -H "Content-Type: application/json" \
  -d '{
    "batch_id": 1,
    "pickup_otp": "784920"
  }'
```

---

### Module E — Sustainability & ESG Analytics

#### `GET /api/v1/analytics/dashboard`
```bash
curl http://127.0.0.1:8000/api/v1/analytics/dashboard
```
**Response (200 OK):**
```json
{
  "total_recovered_revenue_inr": 540.0,
  "total_scrap_diverted_kg": 2.25,
  "total_meals_redistributed": 12,
  "total_co2e_avoided_kg": 5.625,
  "active_specials_count": 1,
  "active_ngos_count": 4,
  "total_scrap_logged_kg": 9.2
}
```

---

## Production Deployment (PostgreSQL)

To deploy to production using PostgreSQL:

1. Update `.env`:
   ```bash
   DATABASE_URL=postgresql+psycopg://postgres:your_password@db.yourhost.com:5432/kitchenos
   ```
2. Run with production workers:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   ```
