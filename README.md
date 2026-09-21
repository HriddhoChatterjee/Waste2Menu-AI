# 🌿 Waste2Menu
> **A Zero-Waste Reverse Recipe & Byproduct Optimization Engine**  
> *A community-first, non-commercial platform celebrating Indian kitchen wisdom to protect nature from food waste.*

---

## 📖 Mission Statement
> *“In nature, nothing is lost, everything is transformed.”*

Modern households and community caterers generate hundreds of tons of avoidable food waste every day. **Waste2Menu** rejects the culture of food waste by digitizing ancestral Indian culinary wisdom. It transforms kitchen discards—vegetable peels, fibrous green stems, jackfruit seeds, stale rotis, overnight cooked rice, and paneer whey—into nourishing, delicious family meals. 

This platform is **strictly non-commercial**:
- ❌ NO point-of-sale (POS) registers or customer billing
- ❌ NO pricing tiers, profit margins, or invoice ledgers
- ✅ 100% focused on food scrap valorization, ancestral rasoi wisdom, and 1-tap surplus meal redistribution to non-profit shelters.

---

## 🌟 Key Features

### 1. 🥕 30 Kitchen Ingredients & Scraps Interactive Catalog
- **Unblocked Multi-Select Matrix**: All 30 traditional Indian kitchen byproducts organized across 5 categories as per the reference guide. Available to every visitor with zero guest blockers.
- **Multi-Lingual Live Search**: Instant live debounced search across English and Pan-Indian regional aliases (*Turai Chilka, Lauki Chilka, Posto Khosha, Fulkopi Danta, Basi Roti, Panta Bhaat, Kathal Beej, Paneer Whey*).
- **6 Category Filter Tabs**: Quick filtering across `All (30)`, `🥔 Vegetable Peels & Skins (9)`, `🌿 Stems, Stalks & Leaves (6)`, `🍉 Seeds, Piths & Rinds (5)`, `🍚 Grains, Starches & Staples (5)`, and `🥛 Dairy & Spice Discards (5)`.
- **Floating Bottom Action Bar**: Live selected count and matching recipe counter with instant 1-tap transition to matching dishes.

### 2. 🏡 Home Chef (Reverse Recipe & Cooking Hub)
- **Scrap-to-Recipe Reverse Engine**: Select counter discards and discover authentic dishes.
- **Interactive Recipe Checklist**: Mark off available pantry spices and track cooking steps in real time.
- **🔊 Hands-Free Voice Guide (Web Speech API)**: Built-in voice synthesizer reads ingredients and instructions aloud so home cooks can follow steps without touching screens while cooking.
- **❤️ Saved Favorites Cookbook**: Bookmark preferred zero-waste recipes for quick reference anytime.
- **Nature Impact Tracking**: Displays estimated kg of food scrap diverted from landfills and CO₂ emissions prevented per dish.

### 3. 👨‍🍳 Master Chef Recipe Authoring Studio
- **Document Ancestral Zero-Waste Wisdom**: Chefs, grandmothers, and culinary mentors can document traditional byproduct recipes with regional heritage attribution.
- **Dynamic Ingredient & Step Builders**: Add spices and instructions dynamically with 1-click controls.
- **Immediate Catalog Sync**: New recipes instantly persist to the database and become searchable.

### 4. 🤝 Community NGO Surplus Food Dispatch
- **1-Tap Surplus Food Broadcast**: Community kitchens, banquet halls, and temples broadcast freshly prepared surplus food with portion counts, pickup landmarks, and contact details.
- **Live Shelter Claim Board**: Verified NGOs and shelters can claim meal batches in one tap to feed needy community members.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5, CSS3, Vanilla JS (ES6+) | Light Cream artisanal UI (`#FBF9F5`, `#FFFFFF`, `#EADBCE`, `#2E7D32`, `#D97706`, `#221F1B`, `#6B635B`). Zero build steps, zero client libraries required. |
| **Voice Engine** | Web Speech API | Native browser speech synthesis for hands-free kitchen voice guidance. |
| **Backend REST API**| Python 3.10+, FastAPI, Uvicorn | High-performance asynchronous API endpoints for auth, recipes, scraps, and NGO dispatches. |
| **Relational Database** | PostgreSQL 12+ / pgAdmin 4 | Normalized schema with foreign keys (`schema.sql` and `seed_data.sql`). |
| **Local Fallback** | SQLite (`waste2menu.db`) | Automatic embedded fallback enabling zero-configuration instant local execution with all 30 PDF scraps & recipes. |

---

## 🚀 Quick Start

### 1. Instant Run (Zero Configuration)
The backend automatically falls back to an embedded SQLite database (`waste2menu.db`) pre-seeded with all 30 recipes and scraps:

```powershell
# In project root:
python server.py
```
Open your browser at:
```
http://localhost:8000
```

### 2. PostgreSQL & pgAdmin 4 Setup
To connect with PostgreSQL and pgAdmin 4:
1. Open **pgAdmin 4**, create a database named `annapurna_db`.
2. Open the **Query Tool** and execute `schema.sql`.
3. Open the **Query Tool** and execute `seed_data.sql`.
4. Set your PostgreSQL password and start the server:
   ```powershell
   $env:DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/annapurna_db"
   python server.py
   ```

*For complete step-by-step screenshots and presentation defense talking points, refer to [SETUP_GUIDE.md](SETUP_GUIDE.md).*

---

## 📜 License
Open-source under the MIT License. Dedicated to circular gastronomy, environmental sustainability, and food security.
