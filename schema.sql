-- ============================================================================
-- PROJECT: Waste2Menu — A Zero-Waste Reverse Recipe & Byproduct Optimization Engine
-- DATABASE SCHEMA SPECIFICATION (PostgreSQL / pgAdmin 4)
-- ============================================================================
-- Description:
-- Clean, well-indexed relational DDL for community food scrap valorization,
-- authentic Indian reverse-recipes, and chef-to-NGO surplus dispatches.
-- Compatible with pgAdmin 4 Query Tool and PostgreSQL 12+.
-- ============================================================================

DROP TABLE IF EXISTS ngo_dispatches CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS byproduct_scraps CASCADE;
DROP TABLE IF EXISTS scrap_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ----------------------------------------------------------------------------
-- 1. Table: users (Authentication: Master Chef vs Home Chef)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'home_chef' CHECK (role IN ('master_chef', 'home_chef', 'ngo_rep')),
    affiliation VARCHAR(180) DEFAULT 'Community Rasoi',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ----------------------------------------------------------------------------
-- 2. Table: scrap_categories
-- Represents broad scrap families as defined in the Indian Kitchen Byproduct Guide
-- ----------------------------------------------------------------------------
CREATE TABLE scrap_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    short_name VARCHAR(80) NOT NULL,
    icon_svg TEXT NOT NULL,
    description TEXT
);

-- ----------------------------------------------------------------------------
-- 3. Table: byproduct_scraps
-- 30 specific household food byproducts with English and regional Indian names
-- ----------------------------------------------------------------------------
CREATE TABLE byproduct_scraps (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES scrap_categories(id) ON DELETE RESTRICT,
    name_en VARCHAR(150) NOT NULL,
    name_regional VARCHAR(250) NOT NULL,
    common_uses TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_byproduct_scraps_category ON byproduct_scraps(category_id);
CREATE INDEX idx_byproduct_scraps_name_en ON byproduct_scraps(name_en);
CREATE INDEX idx_byproduct_scraps_name_reg ON byproduct_scraps(name_regional);

-- ----------------------------------------------------------------------------
-- 4. Table: recipes
-- Traditional and Master Chef contributed reverse recipes
-- ----------------------------------------------------------------------------
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    scrap_id INT NOT NULL REFERENCES byproduct_scraps(id) ON DELETE CASCADE,
    chef_name VARCHAR(120) NOT NULL DEFAULT 'Community Kitchen Hero',
    chef_affiliation VARCHAR(180) NOT NULL DEFAULT 'Rasoi Heritage',
    prep_time_minutes INT NOT NULL DEFAULT 15,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'Easy',
    course_type VARCHAR(60) NOT NULL DEFAULT 'Chutney/Dip',
    dietary_type VARCHAR(50) NOT NULL DEFAULT 'Pure Veg',
    pantry_staples JSONB NOT NULL DEFAULT '[]'::jsonb,
    step_by_step_instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    chef_wisdom_tip TEXT,
    servings INT NOT NULL DEFAULT 4,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recipes_scrap ON recipes(scrap_id);
CREATE INDEX idx_recipes_course ON recipes(course_type);
CREATE INDEX idx_recipes_dietary ON recipes(dietary_type);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);

-- ----------------------------------------------------------------------------
-- 5. Table: ngo_dispatches
-- 1-tap surplus food dispatch alerts broadcast from community/chef kitchens
-- ----------------------------------------------------------------------------
CREATE TABLE ngo_dispatches (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id) ON DELETE SET NULL,
    dish_name VARCHAR(250) NOT NULL,
    prepared_by_chef VARCHAR(120) NOT NULL,
    portions_available INT NOT NULL CHECK (portions_available > 0),
    pickup_location TEXT NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLAIMED', 'COLLECTED')),
    claimed_by_ngo VARCHAR(150),
    claim_otp VARCHAR(10),
    dietary_tag VARCHAR(50) DEFAULT 'Pure Veg',
    ready_time VARCHAR(80) DEFAULT 'Hot & Ready Now',
    scrap_source VARCHAR(120),
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ngo_dispatches_status ON ngo_dispatches(status);
CREATE INDEX idx_ngo_dispatches_created ON ngo_dispatches(created_at DESC);
