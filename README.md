# 🍲 Waste2Menu-AI

> **Autonomous Closed-Loop Kitchen Prep-Scrap Monetization, Dynamic POS Engine & Humanitarian Surplus Redistribution Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📌 Executive Overview

Traditional restaurant POS and ERP systems rely on a rigid **Forward Bill-of-Materials (BOM)**: customer orders deduct inventory, while pre-consumer prep scraps (such as bones, vegetable skins, citrus rinds, and herb stems) are treated as unmonetized loss—accounting for **8% to 18%** of commercial kitchen food waste.

**Waste2Menu-AI** inverts this paradigm with a **Reverse Ingredient Dependency Engine (RIDE)**. It dynamically quantifies prep byproducts, runs machine learning anomaly audits on knife efficiency, optimizes recipe batch yields using Integer Linear Programming, and injects high-margin ephemeral daily specials directly into the live POS. If portions remain unsold by closing time, an automated geospatial dispatch engine matches and locks surplus hot meals for nearby verified NGOs via an OTP handshake.

---

## 🔄 End-to-End System Architecture

```text
[ Kitchen Prep Line ] ─────────► [ Reverse Recipe Engine ] ─────────► [ Cashier POS & Digital Menu ]
  • Vision/scale scrap logging     • Byproduct recipe matching          • Ephemeral SKU injection
  • Isolation Forest yield check   • PuLP Integer Linear Solver        • Atomic portion decrements
  • Active Reservoir accumulation  • Chef 1-tap KDS approval           • Auto-delist on stockout
                                                                                    │
                                                                   (Shift End / Unsold Stock)
                                                                                    ▼
[ Sustainability Analytics ] ◄─── [ 6-Digit OTP Handover ] ◄─── [ NGO Proximity Dispatch ]
  • Recovered P&L ledger           • Cashier counter verification      • Haversine matrix routing
  • Avoided CO2e & water metrics   • Physical chain of custody         • Atomic status locking
```

---

## ✨ Core Features

* 🔪 **Smart Prep Logging & Anomaly Detection:** Ingests prep trimmings and audits knife technique in real time using an unsupervised **Isolation Forest** anomaly detector to flag excessive yield loss against baseline cut metrics.
* 🧠 **Reverse Recipe Batch Optimizer (RIDE):** Solves multi-scrap combinatorial constraints using **Integer Linear Programming (PuLP)** to verify batch feasibility (>= 8 servings) and compute high-margin pricing (>85% gross margin) with near-zero raw ingredient costs.
* ⚡ **Live POS Ephemeral Injection:** Automatically spawns dynamic SKUs on cashier screens and QR menus with live scarcity badging (`🔥 Only 12 Left`) and executes atomic inventory decrements per order.
* 🏷️ **Closing-Hour Flash Markdown:** Dynamically adjusts time-decay discounts during the final 90 minutes of service to accelerate byproduct inventory liquidation.
* 📍 **Geospatial NGO Redistribution Fallback:** Automatically aggregates unsold portions at shift close, identifies active shelters within 10 km via the **Haversine formula**, and manages physical handovers using a secure **6-digit OTP handshake**.
* 📊 **ESG & Financial Analytics Ledger:** Aggregates recovered byproduct revenue alongside calculated environmental metrics:
  - Avoided CO2e (kg) = Rescued Weight (kg) * 2.5
  - Saved Water (Liters) = Rescued Weight (kg) * 80

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion |
| **State & Sync** | Zustand, TanStack Query, WebSockets / Server-Sent Events |
| **Backend API** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 |
| **Database & ORM** | PostgreSQL 15+ / SQLite (Dev), SQLAlchemy 2.0 / Prisma ORM |
| **Optimization & ML** | PuLP (Integer Linear Programming), scikit-learn (Isolation Forest), NumPy |
| **Geospatial & Security** | Haversine Great-Circle Proximity Algorithm, 6-Digit OTP Verification |

---

## 📁 Repository Structure

```text
Waste2Menu-AI/
├── backend/
│   ├── app/
│   │   ├── api/v1/            # FastAPI REST routers (scrap, recipes, pos, fallback, analytics)
│   │   ├── core/              # Config, DB connection pool, security
│   │   ├── models/            # SQLAlchemy database models
│   │   ├── schemas/           # Pydantic validation schemas
│   │   └── services/          # PuLP optimizer, ML anomaly auditor, Haversine matcher
│   ├── main.py                # Server entry point & auto-seed lifecycle
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── kitchen/       # Scrap entry & Active Reservoir view
│   │   │   ├── recipes/       # Reverse recipe optimizer & KDS approval
│   │   │   ├── pos/           # Cashier terminal & live portion decrement
│   │   │   ├── ngo/           # NGO surplus claim feed & OTP verification
│   │   │   └── analytics/     # P&L recovery & ESG impact dashboards
│   │   ├── components/        # Modern dark-themed UI components
│   │   └── store/             # Global client state stores
│   ├── tailwind.config.ts
│   └── package.json
├── prisma/
│   ├── schema.prisma          # PostgreSQL relational schema
│   └── seed.ts                # Chennai demo seed script
└── README.md
```

---

## 🚀 Quickstart Guide

### Prerequisites
* Node.js 18+ & npm / pnpm
* Python 3.11+
* Git

### 1. Clone Repository
```bash
git clone [https://github.com/HriddhoChatterjee/Waste2Menu-AI.git](https://github.com/HriddhoChatterjee/Waste2Menu-AI.git)
cd Waste2Menu-AI
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
- API Server will start at: http://localhost:8000
- Interactive API Documentation (Swagger UI): http://localhost:8000/docs

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
- Web Portal will be live at: http://localhost:3000

---

## 🔌 API Reference Overview
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/scrap/log` | Ingests prep scrap mass & runs ML knife anomaly check |
| `GET` | `/api/v1/scrap/reservoir` | Retrieves active unallocated scrap totals |
| `GET` | `/api/v1/recipes/match-feasible` | Runs ILP solver to find batch-viable recipes |
| `POST` | `/api/v1/recipes/approve-batch` | Allocates scrap & pushes dynamic ephemeral SKU to POS |
| `GET` | `/api/v1/pos/live-menu` | Returns active dynamic menu items with live portion counters |
| `POST` | `/api/v1/pos/order` | Atomically decrements remaining stock and records sale |
| `POST` | `/api/v1/fallback/trigger-surplus` | Runs closing-hour surplus check & ranks nearby NGOs |
| `POST` | `/api/v1/fallback/claim` | Locks batch for NGO and issues single-use 6-digit OTP |
| `POST` | `/api/v1/fallback/verify-handover` | Verifies OTP at cashier and updates ESG impact ledger |
| `GET` | `/api/v1/analytics/dashboard` | Returns recovered revenue and environmental savings |
---

## 📜 License
Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
