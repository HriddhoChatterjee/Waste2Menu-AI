# Waste2Menu AI — Complete System Architecture & Setup Guide

A comprehensive guide explaining how to set up, run, and understand the **Waste2Menu AI** circular gastronomy platform, including authentication, database persistence, dual user roles (Chef vs. Home Cook), and public vs. private navigation.

---

## 📋 Table of Contents
1. [Overview & Features](#overview--features)
2. [Prerequisites & Quick Start](#prerequisites--quick-start)
3. [Database Architecture & Persistence](#database-architecture--persistence)
4. [Demo Accounts & Credentials](#demo-accounts--credentials)
5. [User Roles & Navigation Flow](#user-roles--navigation-flow)
6. [Step-by-Step Feature Walkthrough](#step-by-step-feature-walkthrough)
7. [Enterprise Prisma / PostgreSQL Setup (Optional)](#enterprise-prisma--postgresql-setup-optional)
8. [Production Build & Deployment](#8-production-build--deployment)
9. [GitHub Pages Deployment (index.html)](#9-github-pages-deployment-indexhtml)

---

## 1. Overview & Features

**Waste2Menu AI** bridges commercial restaurant kitchens and everyday household home cooks:
- **Intelligent Image Upload with AI Vision**: Replaced hardware camera streaming with a reliable drag-and-drop / file upload flow with 4 scenario presets, simulated multi-class neural detection (97-98% confidence), and interactive bounding boxes.
- **Per-Item Weight Controls**: Precision inputs in kilograms (`kg`) and stepper buttons (`-0.1 kg`, `+0.1 kg`, etc.) allowing exact calibration before committing items to the scrap stockpile.
- **Normal Sign In & Register System**: Real email/password authentication, form validation, password show/hide, role selection (**Professional Chef** vs. **Home Cook**), and quick 1-click demo shortcuts.
- **Account Isolation & Sign Out**: Users cannot cross-access or mutate into another user's session without explicitly signing out first.
- **Outside Dashboard Section Navigation**: When logged out, internal kitchen tabs are hidden from public visitors. The navbar displays section anchor tabs (**Overview**, **Dishes Showcase**, **Food Saved**, **How It Works**, **Suites**) for the outside showcase.
- **Light Cream Artisanal Aesthetic**: Warm culinary palette (`#FAF7F2`, `#FFFDF9`, `#E8DFD1`) with rich emerald, amber, and violet accents.

---

## 2. Prerequisites & Quick Start

### Prerequisites
- **Node.js**: Version 18.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: Version 9.0 or higher (comes bundled with Node.js)
- **Modern Web Browser**: Chrome, Edge, Safari, or Firefox

### Step-by-Step Setup

1. **Open the Project Directory**:
   ```bash
   cd h:\Waste2Menu-AI
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to the local URL displayed in the terminal:
   ```
   http://localhost:5175/Waste2Menu-AI/
   ```
   *(or `http://localhost:5173/Waste2Menu-AI/` depending on your port)*

---

## 3. Database Architecture & Persistence

Waste2Menu AI features a **two-tier database architecture**:

### 1. Browser-Persistent Client Database (`src/services/db.ts`) — *Active Out-of-the-Box*
- Zero configuration required. Works instantly upon running `npm run dev`.
- Uses a persistent structured JSON storage service in the browser (`localStorage`).
- Automatically handles:
  - **User Accounts**: Seeded with default accounts; stores newly registered chefs and home users permanently.
  - **Authentication & Sessions**: Manages session tokens across page reloads.
  - **Custom Recipes**: Saves recipes authored by chefs into the shared catalog.
  - **Scraps & Intake**: Maintains live inventory weights.
- When you register a new user, author a recipe, or commit food scraps, your data **persists across browser refreshes**.

### 2. Enterprise Relational Schema (`prisma/schema.prisma`) — *For Backend Deployment*
- A production-grade PostgreSQL database schema is included with full relational tables:
  - `User`, `Restaurant`, `RawInventory`, `ScrapLedger`, `Recipe`, `SpecialSKU`, `Order`, `NgoBatch`, `NgoPartner`, and `AuditLog`.
- See [Section 7](#enterprise-prisma--postgresql-setup-optional) if you wish to run a dedicated PostgreSQL server.

---

## 4. Demo Accounts & Credentials

The system comes pre-seeded with two authentic workspace accounts. You can also click the **"Chef Demo"** or **"Home User Demo"** buttons on the Sign In form for instant 1-click access:

| Account Role | Email Address | Password | Name | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **👨‍🍳 Professional Chef** | `chef@waste2menu.com` | `chef123` | Chef Aarav Singhania | Commercial Kitchen: Prep Intake, Recipe Studio & Authoring, POS Specials, NGO Hub, Staff Analytics |
| **🏡 Home Cook / Normal User** | `user@waste2menu.com` | `user123` | Priya Sharma | Home Zero-Waste: Upload leftover photos, weight entry, cook chef recipes, personal food saved impact |

You can also click **Register** to create any number of custom accounts (e.g., your own name, restaurant name, and chosen role).

---

## 5. User Roles & Navigation Flow

The navigation bar dynamically adapts depending on whether you are logged in and which role you hold:

### State A: Public Outside Dashboard (Logged Out / Guest)
- **Top Navigation Tabs**:
  - 🌟 **Overview**: Hero section and project mission.
  - 🍲 **Dishes Showcase**: 45-second slow continuous horizontal scrolling dish marquee.
  - 📊 **Food Saved**: Quantified diversion ledger and metric cards (Mirepoix peels, bones, crusts, citrus rinds, herb stems).
  - 💡 **How It Works**: 3-step AI intake and circular loop explanation.
  - 👥 **Kitchen Suites**: Comparison of Commercial Kitchen vs. Home Cook workflows.
- **Top Right Buttons**:
  - `[ Sign In ]` (opens the Sign In tab)
  - `[ Register ]` (opens the Register tab)
- **Security**: All internal kitchen/home stations are protected.

### State B: Professional Chef (Logged In)
- **Top Navigation Tabs**:
  - 📊 **Dashboard**: Master project dashboard with marquee and impact ledger.
  - ⚖️ **Prep & Scraps**: Photo upload, AI neural bounding boxes, and per-item weight inputs.
  - 👨‍🍳 **Recipe Studio**: Browse recipes, filter by "My Authored Dishes", filter "Feasible from Stock", and click **"+ Author New Recipe"** to compose custom dishes.
  - 💳 **POS Specials**: Cashier register terminal with dynamic specials and flash markdown sliders.
  - 🤝 **NGO Surplus**: Broadcast unsold portions to partner charities and verify driver OTPs.
  - 📈 **Analytics**: Cook knife loss variance benchmarks and ISO 14001 ESG audit certificates.
- **Top Right Profile**:
  - Displays Chef Aarav's avatar, name, and Executive Chef badge.
  - Clicking opens the profile drawer with stats and the **Sign Out** button.

### State C: Home Cook / Normal User (Logged In)
- **Top Navigation Tabs**:
  - 📊 **Dashboard**: Master project dashboard.
  - 📸 **Upload Scraps**: Upload photo of household leftovers and enter weights.
  - 🍲 **Chef Recipes**: Cook reverse recipes designed by professional chefs with pantry checklists.
  - 🌿 **My Waste Impact**: Personal household food diversion counter.
- **Top Right Profile**:
  - Displays Priya Sharma's avatar, name, and Home Cook badge.
  - Clicking opens the profile drawer with stats and the **Sign Out** button.

---

## 6. Step-by-Step Feature Walkthrough

### 1. Registering a New Account
1. On the public dashboard, click **Register** in the top-right navbar.
2. Choose your role: **Professional Chef** or **Home Cook**.
3. Fill in your Name, Email, Password, and Restaurant Name (if Chef).
4. Click **Register & Enter Workspace**.
5. You are immediately authenticated, your account is saved into the database, and your station tabs appear!

### 2. Uploading Scraps & Entering Item Weights
1. Navigate to **Prep & Scraps** (Chef) or **Upload Scraps** (Home Cook).
2. Either drag & drop a food photo, select a file from your computer, or click one of the 4 sample presets (e.g., *Mirepoix Peels & Tops* or *Roast Chicken Bones*).
3. The AI scanning animation runs, highlighting detected items with bounding boxes and confidence scores.
4. Use the weight controls to enter or adjust the weight (in `kg`) for each detected item using the stepper buttons (`-0.1 kg`, `+0.1 kg`, `-0.5 kg`, `+0.5 kg`) or direct numeric input.
5. Click **Commit to Kitchen Reservoir** to update the live stockpile or **Find Recipes for These Items** to see matching dishes.

### 3. Authoring a Custom Chef Recipe
1. Log in as a Chef and navigate to **Recipe Studio**.
2. Click **+ Author New Recipe** (in the header or sub-tabs).
3. Enter the Dish Title, Description, Scrap Category, Scrap Weight (kg), Yield Portions, Suggested Price, Prep Time, and numbered cooking instructions.
4. Click **Publish Recipe to KDS & Menu**.
5. The recipe is saved to the database, stamped with your name (`author: "Chef Aarav Singhania"`), and instantly appears under the **My Authored Dishes** sub-tab and in the Home Cook recipe feed!

### 4. Signing Out
1. Click on the user profile pill in the top-right header.
2. A drawer opens displaying your session status and statistics.
3. Click the crimson **Sign Out of Account** button.
4. Your session is terminated, you return to the public outside dashboard, and the station tabs disappear until you sign in again.

---

## 7. Enterprise Prisma / PostgreSQL Setup (Optional)

If you wish to connect Waste2Menu AI to an external PostgreSQL database server:

1. **Install PostgreSQL** locally or use a cloud provider (Neon, Supabase, AWS RDS).
2. **Create a `.env` file** in the project root:
   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/waste2menu_db?schema=public"
   ```
3. **Run Prisma Migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```
4. **Seed the PostgreSQL Database**:
   ```bash
   npx tsx prisma/seed.ts
   ```
5. **Open Prisma Studio (Visual GUI)**:
   ```bash
   npx prisma studio
   ```

---

## 8. Production Build & Deployment

### Production Build
To compile the application for production:
```bash
npm run build
```

This runs:
- `tsc -b`: TypeScript compiler ensuring strict type-safety with 0 errors.
- `vite build`: Minifies CSS and JavaScript into the production-ready `dist/` bundle.

To test the production build locally:
```bash
npm run preview
```

---

## 9. GitHub Pages Deployment (`index.html`)

Waste2Menu AI is configured for seamless deployment to **GitHub Pages**:

### How It Works:
1. **Root `index.html` Entry Point**:
   - The production build generates `dist/index.html` with relative asset paths (`./assets/...` via `base: './'`).
   - This ensures that scripts and styles resolve correctly regardless of whether the site is hosted at `https://<username>.github.io/<repo>/` or a custom domain.
2. **Automated Deployment with GitHub Actions (`.github/workflows/deploy.yml`)**:
   - A pre-configured GitHub Actions workflow automatically builds and publishes the `dist/` directory to GitHub Pages upon pushing to the `main` branch.
   - To enable this in your GitHub repository:
     1. Push your code to GitHub:
        ```bash
        git add .
        git commit -m "Configure GitHub Pages deployment"
        git push origin main
        ```
     2. In your GitHub repository, navigate to **Settings** &rarr; **Pages**.
     3. Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
     4. GitHub will automatically run the deployment workflow and host your live site.
3. **SPA Routing Fallback (`public/404.html`)**:
   - Includes `404.html` in `public/` which redirects any direct page reloads back to `index.html` without broken links.

---

*Waste2Menu AI — Circular Gastronomy, AI Computer Vision & Zero-Waste Kitchen Operations.*
