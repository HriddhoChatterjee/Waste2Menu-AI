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
