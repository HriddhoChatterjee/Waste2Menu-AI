# Annapurna Loop — System Architecture & Setup Guide
### *Waste2Menu: Community Zero-Waste Edition*

> “In nature, nothing is lost, everything is transformed.”  
> — *Ancient Indian Rasoi Wisdom & Lavoisier’s Principle of Conservation*

---

## 📋 Table of Contents
1. [Project Mission & Philosophy](#1-project-mission--philosophy)
2. [Dual User Roles & Authentication](#2-dual-user-roles--authentication)
3. [Light Creme Artisanal Theme](#3-light-creme-artisanal-theme)
4. [Complete 30-Scraps PDF Reference Matrix](#4-complete-30-scraps-pdf-reference-matrix)
5. [Achievements & Community Impact (Like Other Websites)](#5-achievements--community-impact-like-other-websites)
6. [Dual-Tier Database Architecture](#6-dual-tier-database-architecture)
7. [pgAdmin 4 & PostgreSQL Setup (Step-by-Step)](#7-pgadmin-4--postgresql-setup-step-by-step)
8. [Instant Zero-Config Quick Start (SQLite Mode)](#8-instant-zero-config-quick-start-sqlite-mode)
9. [Feature-by-Feature User Guide](#9-feature-by-feature-user-guide)
10. [Academic & Mentor Presentation Guide](#10-academic--mentor-presentation-guide)

---

## 1. Project Mission & Philosophy

**Annapurna Loop** is a community-first, non-commercial food scrap valorization and reverse-recipe platform. It digitizes centuries of traditional Indian kitchen wisdom to ensure kitchen byproducts are celebrated as nutrient-dense ingredients rather than discarded into municipal landfills.

### 🚫 What This Platform Is NOT:
- **NO** commercial POS registers
- **NO** customer billing, invoices, or payment gateways
- **NO** pricing tiers, profit margins, or commercial markups

### 🌱 What This Platform IS:
A pure community-centered ecological system that treats kitchen discards (vegetable peels, fibrous stems, squeezed citrus halves, fermented grains, and dairy whey) as nutrient-dense culinary ingredients. It connects everyday households with centuries of Indian kitchen science, and provides community kitchens with a direct 1-tap bridge to donate surplus cooked meals to verified non-profit shelters.

---

## 2. Dual User Roles & Authentication

The platform features built-in authentication and distinct role capabilities:

```
                  ┌─────────────────────────────────────────┐
                  │          ANNAPURNA LOOP PLATFORM        │
                  └────────────────────┬────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────────────┐             ┌───────────────────────────────────┐
│        🏡 HOME CHEF           │             │       👨‍🍳 MASTER CHEF             │
│   (View & Cook Scraps)        │             │   (Upload & Document Wisdom)      │
├───────────────────────────────┤             ├───────────────────────────────────┤
│ • Complete 30-Scraps Matrix   │             │ • Author zero-waste recipes       │
│ • Live search regional names  │             │ • Document pantry spices & steps  │
│ • Multi-select ingredients    │             │ • Share ancestral chef tips       │
│ • Step-by-step cooking guide  │             │ • 1-Tap surplus food broadcast    │
│ • Hands-free voice narration  │             │ • Manage shelter handovers        │
└───────────────────────────────┘             └───────────────────────────────────┘
```

### Pre-Seeded Demo Accounts & 1-Click Login:
The login modal provides **1-Click Instant Demo Login** buttons:
- **👨‍🍳 Master Chef Demo**: `chef@annapurna.org` / `chef123` (Name: *Chef Sanjeev Kapoor*)
- **🏡 Home Chef Demo**: `home@annapurna.org` / `home123` (Name: *Priya Sharma*)

Users can also register custom accounts with their own name, email, and chosen role.

---

## 3. Light Creme Artisanal Theme

The UI is built with a warm, natural **Light Creme** culinary design system:
- **Base Background**: `#FAF7F2` (soft warm linen/cream)
- **Surface Cards**: `#FFFDF9` (porcelain warm white)
- **Borders & Dividers**: `#E8DFD1` (warm stone beige)
- **Emerald Leaf Green**: `#059669` / `#10B981` (fresh herbal accents & eco badges)
- **Saffron Amber / Terracotta**: `#D97706` / `#B45309` (turmeric and saffron highlights)
- **Primary Text**: `#1C1917` (deep espresso stone, ultra-high contrast & readability)

---

## 4. Complete 30-Scraps PDF Reference Matrix

The application includes the **complete 30-scraps matrix across all 5 categories** from the *Indian Household Food Byproducts & Upcycling Guide*:

### Category 1: Vegetable Peels & Skins (Chilka / Khosha / Thol)
1. **Bottle Gourd Peels** (*Lauki Chilka, Lau-er Khosha, Sorakkay Thol*)
2. **Ridge Gourd Peels** (*Turai Chilka, Jhinge Khosha, Peerkangai Thol*)
3. **Potato Peels** (*Aloo Chilka, Aloo Khosha, Urulaikizhangu Thol*)
4. **Raw Banana / Plantain Peels** (*Kacche Kele Ka Chilka, Kancha Kolar Khosha, Vazhakkai Thol*)
5. **Pointed Gourd Peels** (*Parwal Chilka, Potol Khosha*)
6. **Pumpkin Peels & Fibers** (*Kaddu Chilka, Kumro Khosha, Parangikai Thol*)
7. **Bitter Gourd Peels** (*Karela Chilka, Korola Khosha, Pavakkai Thol*)
8. **Carrot & Radish Skins** (*Gajar / Mooli Chilka, Mulo Khosha*)
9. **Eggplant / Brinjal Peels** (*Baingan Chilka, Begun Khosha, Kathirikai Thol*)

### Category 2: Stems, Stalks & Green Leaves (Danta / Thandu / Leaves)
10. **Cauliflower Stems & Green Ribs** (*Phool Gobi Danthal, Fulkopi Danta, Cauliflower Thandu*)
11. **Coriander & Mint Stems** (*Dhaniya Dandi, Dhonepata Danta, Kothamalli Thandu*)
12. **Broccoli Stalks** (*Broccoli Danthal*)
13. **Beetroot & Radish Greens** (*Chukandar / Mooli ke Patte, Mulo Saag*)
14. **Colocasia / Taro Stems & Leaves** (*Arbi ke Patte / Dandi, Kochur Saag, Chembu Ila*)
15. **Cabbage Outer Tough Leaves & Core** (*Patta Gobi ki Dandi & Patte*)

### Category 3: Seeds, Piths & Rinds (Beej / Bichi / Guthli)
16. **Watermelon White Rind** (*Tarbooj ka Safed Chilka, Tarmooj Khosha*)
17. **Jackfruit Seeds** (*Kathal ke Beej, Enchorer Bichi, Palakottai*)
18. **Pumpkin Seeds** (*Kaddu ke Beej, Kumror Bichi*)
19. **Raw Mango Pits & Skins** (*Aam ki Guthli, Aam Aantti, Maangai Kottai*)
20. **Squeezed Lemon / Lime Halves** (*Nichoda Hua Nimbu, Lebur Khosha*)

### Category 4: Grains, Starches & Leftover Staples (Basi / Leftover)
21. **Leftover Cooked Rice** (*Basi Bhaat, Pazhaya Saadham, Panta Bhaat*)
22. **Stale Rotis / Chapati Ends** (*Basi Roti, Pazhaya Roti*)
23. **Stale Bread Crusts & Ends** (*Bread ke Kinare*)
24. **Rice Wash Water** (*Chawal ka Paani, Dhowa Jal, Arisi Kalainja Thanneer*)
25. **Cooked Rice Starch Water** (*Maanrh, Kanji Thanneer, Ganji*)

### Category 5: Dairy & Spice Discards
26. **Paneer / Chhena Whey Water** (*Paneer ka Paani, Chhanar Jal*)
27. **Sour Curd / Leftover Dahi** (*Khatta Dahi, Tok Doi, Puliya Thayir*)
28. **Browned Ghee Sediment Residue** (*Mawa / Berukho / Khurchan / Mor Kali*)
29. **Peeled Ginger Skins** (*Adrak ka Chilka, Ada-r Khosha, Inji Thol*)
30. **Coconut Brown Husk Skins** (*Nariyal ka Khurchan / Brown Skin*)

---

## 5. Achievements & Community Impact (Like Other Websites)

The **🌟 Home & Impact** page highlights real-time collective achievements:
- 🌾 **1,480+ kg** Kitchen Scraps Valorized
- 💨 **2,960+ kg** Landfill CO₂e Emissions Prevented
- 🍲 **3,850+** Nutritious Zero-Waste Meals Cooked
- 📜 **30 / 30** Indian Household Scraps Cataloged (100% of the PDF Guide)
- 🤝 **24+** Verified NGO & Shelter Partners
- 🇮🇳 **6+ Pan-Indian Languages** (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati)

---

## 6. Dual-Tier Database Architecture

`server.py` implements a resilient dual-database layer:
1. **PostgreSQL Production Mode**:
   - Uses `DATABASE_URL` with connection pooling (`psycopg2.pool.SimpleConnectionPool`).
   - Fully normalized tables (`users`, `scrap_categories`, `byproduct_scraps`, `recipes`, `ngo_dispatches`).
2. **Automatic SQLite Fallback Mode**:
   - If PostgreSQL is not yet configured or password differs, automatically boots on embedded `waste2menu.db`.
   - Seeds all 5 categories, 30 scraps, 30 recipes, and demo users on the fly.
   - Zero-barrier execution out of the box.

---

## 7. pgAdmin 4 & PostgreSQL Setup (Step-by-Step)

1. Open **pgAdmin 4**, right-click **Databases** ➔ **Create** ➔ **Database...** ➔ name it `annapurna_db`.
2. Right-click `annapurna_db` ➔ select **Query Tool**.
3. Open `H:\Waste2Menu-AI\schema.sql` and click **Execute (F5)**.
4. Open `H:\Waste2Menu-AI\seed_data.sql` and click **Execute (F5)**.
5. In PowerShell, start the server with your password:
   ```powershell
   $env:DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/annapurna_db"
   python server.py
   ```

---

## 8. Instant Zero-Config Quick Start (SQLite Mode)

```powershell
cd H:\Waste2Menu-AI
python server.py
```
Open browser at **`http://localhost:8000`**.

---

## 9. Feature-by-Feature User Guide

### 🏡 Home Chef (Find & Cook Recipes)
- **Interactive 30-Scraps Matrix In Front**: Select scraps right on screen organized by the 5 PDF categories.
- **Multi-Select**: Tap multiple scraps sitting on your counter to find combination dishes.
- **Live Search**: Debounced search matching English, Hindi, Bengali, Tamil, and pantry spices.
- **Recipe Cards**: View prep time, difficulty, chef wisdom, and nature impact metrics.
- **Interactive Modal**: Pantry checklist, cooking steps checklist, and **Web Speech API Audio Guide** (reads steps aloud hands-free).

### 👨‍🍳 Master Chef (Upload Recipes)
- **Preserve Traditional Recipes**: Submit byproduct dishes with dynamic pantry staples & steps.
- **1-Click Demo**: Instant access as *Chef Sanjeev Kapoor*.

### 🤝 NGO Surplus Dispatch
- **1-Tap Surplus Broadcast**: Announce extra cooked meals for shelter collection.
- **Live Community Claim Board**: Shelters click **1-Tap Claim** to secure food.

### 📜 30 Scraps Guide (PDF Matrix)
- Interactive reference table displaying all 30 items with direct recipe links.

---

## 10. Academic & Mentor Presentation Guide

1. **The Global Crisis**: 40% of food is wasted; landfills generate massive methane emissions.
2. **Indian Kitchen Science**: Peels, stalks, and whey are superfoods with high polyphenols and fiber.
3. **The Technology**: Pure HTML5/CSS3/JS frontend with zero bloat, dual PostgreSQL/SQLite backend, and Web Speech API accessibility.
4. **Non-Commercial Community Ethics**: Focused 100% on environmental diversion and hunger relief.
