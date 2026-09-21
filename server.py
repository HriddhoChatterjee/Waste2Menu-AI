"""
============================================================================
PROJECT: Annapurna Loop (Waste2Menu: Community Zero-Waste Edition)
BACKEND SERVER: FastAPI REST API & Dual PostgreSQL / SQLite Persistence
============================================================================
Mission:
A community-first, non-commercial food scrap valorization platform.
Supports PostgreSQL (for pgAdmin 4 setups) with an automatic,
seamless fallback to SQLite (annapurna.db) for zero-barrier local execution.
============================================================================
"""

import os
import json
import sqlite3
import logging
from typing import List, Optional, Dict, Any
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("AnnapurnaLoop")

# Base Paths
BASE_DIR = Path(__file__).resolve().parent
DB_FILE = BASE_DIR / "annapurna.db"
SEED_FILE = BASE_DIR / "seed_data.json"

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/annapurna_db")
USE_POSTGRES = False
pg_pool = None

# Attempt PostgreSQL connection if psycopg2 is present
try:
    import psycopg2
    from psycopg2 import pool
    from psycopg2.extras import RealDictCursor

    try:
        # Test connection with a short 3s timeout
        test_conn = psycopg2.connect(DATABASE_URL, connect_timeout=3)
        test_conn.close()
        pg_pool = pool.SimpleConnectionPool(1, 10, DATABASE_URL)
        USE_POSTGRES = True
        logger.info(f"Connected successfully to PostgreSQL at: {DATABASE_URL.split('@')[-1]}")
    except Exception as pg_err:
        logger.warning(f"PostgreSQL connection to '{DATABASE_URL}' was not reachable ({pg_err}).")
        logger.info(f"Seamlessly operating on embedded SQLite engine: {DB_FILE.name}")
        USE_POSTGRES = False
except ImportError:
    logger.info("psycopg2 not installed; using embedded SQLite engine.")
    USE_POSTGRES = False


# ============================================================================
# DATABASE INITIALIZATION & SCHEMA CREATION
# ============================================================================

def init_sqlite_db():
    """Initializes SQLite tables and seeds them from seed_data.json if empty or schema changed."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")

    # 1. users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'home_chef' CHECK (role IN ('master_chef', 'home_chef')),
        affiliation TEXT DEFAULT 'Community Rasoi',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. scrap_categories
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scrap_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        short_name TEXT NOT NULL,
        icon_svg TEXT NOT NULL,
        description TEXT
    );
    """)

    # 3. byproduct_scraps
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS byproduct_scraps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL REFERENCES scrap_categories(id) ON DELETE RESTRICT,
        name_en TEXT NOT NULL,
        name_regional TEXT NOT NULL,
        common_uses TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 4. recipes
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        scrap_id INTEGER NOT NULL REFERENCES byproduct_scraps(id) ON DELETE CASCADE,
        chef_name TEXT NOT NULL DEFAULT 'Community Kitchen Hero',
        chef_affiliation TEXT NOT NULL DEFAULT 'Rasoi Heritage',
        prep_time_minutes INTEGER NOT NULL DEFAULT 15,
        difficulty TEXT NOT NULL DEFAULT 'Easy',
        course_type TEXT NOT NULL DEFAULT 'Chutney/Dip',
        dietary_type TEXT NOT NULL DEFAULT 'Pure Veg',
        pantry_staples TEXT NOT NULL DEFAULT '[]',
        step_by_step_instructions TEXT NOT NULL DEFAULT '[]',
        chef_wisdom_tip TEXT,
        servings INTEGER NOT NULL DEFAULT 4,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 5. ngo_dispatches
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ngo_dispatches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipe_id INTEGER REFERENCES recipes(id) ON DELETE SET NULL,
        dish_name TEXT NOT NULL,
        prepared_by_chef TEXT NOT NULL,
        portions_available INTEGER NOT NULL CHECK (portions_available > 0),
        pickup_location TEXT NOT NULL,
        contact_number TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLAIMED', 'COLLECTED')),
        claimed_by_ngo TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Check if re-seeding is needed (e.g. if scraps < 30)
    cursor.execute("SELECT COUNT(*) FROM byproduct_scraps;")
    scrap_count = cursor.fetchone()[0]

    if scrap_count < 30 and SEED_FILE.exists():
        logger.info(f"Seeding SQLite database from {SEED_FILE.name} (30 scraps, 30 recipes, demo users)...")
        try:
            with open(SEED_FILE, "r", encoding="utf-8") as f:
                seed = json.load(f)

            # Clear old records
            cursor.execute("DELETE FROM ngo_dispatches;")
            cursor.execute("DELETE FROM recipes;")
            cursor.execute("DELETE FROM byproduct_scraps;")
            cursor.execute("DELETE FROM scrap_categories;")
            cursor.execute("DELETE FROM users;")

            for u in seed.get("users", []):
                cursor.execute(
                    "INSERT INTO users (id, name, email, password_hash, role, affiliation) VALUES (?, ?, ?, ?, ?, ?);",
                    (u["id"], u["name"], u["email"], u["password_hash"], u.get("role", "home_chef"), u.get("affiliation", "Community Rasoi"))
                )

            for cat in seed.get("categories", []):
                cursor.execute(
                    "INSERT INTO scrap_categories (id, name, short_name, icon_svg, description) VALUES (?, ?, ?, ?, ?);",
                    (cat["id"], cat["name"], cat.get("short_name", cat["name"]), cat["icon_svg"], cat.get("description", ""))
                )

            for sc in seed.get("scraps", []):
                cursor.execute(
                    "INSERT INTO byproduct_scraps (id, category_id, name_en, name_regional, common_uses) VALUES (?, ?, ?, ?, ?);",
                    (sc["id"], sc["category_id"], sc["name_en"], sc["name_regional"], sc.get("common_uses", ""))
                )

            for rc in seed.get("recipes", []):
                cursor.execute(
                    """INSERT INTO recipes (
                        id, title, scrap_id, chef_name, chef_affiliation, prep_time_minutes,
                        difficulty, course_type, dietary_type, pantry_staples,
                        step_by_step_instructions, chef_wisdom_tip, servings
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);""",
                    (
                        rc["id"], rc["title"], rc["scrap_id"], rc["chef_name"], rc["chef_affiliation"],
                        rc["prep_time_minutes"], rc["difficulty"], rc["course_type"], rc["dietary_type"],
                        json.dumps(rc["pantry_staples"]), json.dumps(rc["step_by_step_instructions"]),
                        rc.get("chef_wisdom_tip", ""), rc.get("servings", 4)
                    )
                )

            for dp in seed.get("dispatches", []):
                cursor.execute(
                    """INSERT INTO ngo_dispatches (
                        id, recipe_id, dish_name, prepared_by_chef, portions_available,
                        pickup_location, contact_number, status, claimed_by_ngo, notes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);""",
                    (
                        dp["id"], dp.get("recipe_id"), dp["dish_name"], dp["prepared_by_chef"],
                        dp["portions_available"], dp["pickup_location"], dp["contact_number"],
                        dp.get("status", "ACTIVE"), dp.get("claimed_by_ngo"), dp.get("notes", "")
                    )
                )

            conn.commit()
            logger.info("SQLite database seeded successfully with all 30 scraps, 30 recipes, and demo users!")
        except Exception as seed_err:
            logger.error(f"Failed to seed SQLite database: {seed_err}")
            conn.rollback()

    conn.commit()
    conn.close()


def get_sqlite_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


# Initialize SQLite on module load
init_sqlite_db()


# ============================================================================
# PYDANTIC DATA TRANSFER MODELS
# ============================================================================

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., min_length=5, max_length=180)
    password: str = Field(..., min_length=4, max_length=100)
    role: str = Field("home_chef", pattern="^(master_chef|home_chef)$")
    affiliation: Optional[str] = "Community Rasoi"


class UserLogin(BaseModel):
    email: str
    password: str


class RecipeCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=250)
    scrap_id: int
    chef_name: str = Field(..., min_length=2, max_length=120)
    chef_affiliation: str = Field("Rasoi Heritage", max_length=180)
    prep_time_minutes: int = Field(15, ge=1, le=240)
    difficulty: str = Field("Easy", pattern="^(Easy|Medium|Advanced)$")
    course_type: str = Field("Chutney/Dip", max_length=60)
    dietary_type: str = Field("Pure Veg", max_length=50)
    pantry_staples: List[str] = Field(default_factory=list)
    step_by_step_instructions: List[str] = Field(..., min_items=1)
    chef_wisdom_tip: Optional[str] = None
    servings: int = Field(4, ge=1, le=50)


class DispatchCreate(BaseModel):
    dish_name: str = Field(..., min_length=3, max_length=250)
    prepared_by_chef: str = Field(..., min_length=2, max_length=120)
    portions_available: int = Field(..., ge=1, le=5000)
    pickup_location: str = Field(..., min_length=5)
    contact_number: str = Field(..., min_length=6, max_length=30)
    notes: Optional[str] = None
    recipe_id: Optional[int] = None


class DispatchClaim(BaseModel):
    claimed_by_ngo: str = Field(..., min_length=2, max_length=150)


# ============================================================================
# FASTAPI APPLICATION SETUP
# ============================================================================

app = FastAPI(
    title="Annapurna Loop API",
    description="Community Zero-Waste Food Scrap Valorization & NGO Redistribution Platform",
    version="2.1.0"
)

# Enable CORS for universal access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegister):
    """Register a new user as Master Chef or Home Chef."""
    email = user.email.strip().lower()
    if USE_POSTGRES:
        conn = pg_pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT id FROM users WHERE email = %s;", (email,))
                if cur.fetchone():
                    raise HTTPException(status_code=400, detail="An account with this email already exists.")
                cur.execute(
                    """
                    INSERT INTO users (name, email, password_hash, role, affiliation)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, name, email, role, affiliation;
                    """,
                    (user.name.strip(), email, user.password, user.role, user.affiliation)
                )
                new_user = cur.fetchone()
                conn.commit()
                return new_user
        finally:
            pg_pool.putconn(conn)
    else:
        conn = get_sqlite_connection()
        try:
            row = conn.execute("SELECT id FROM users WHERE email = ?;", (email,)).fetchone()
            if row:
                raise HTTPException(status_code=400, detail="An account with this email already exists.")
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO users (name, email, password_hash, role, affiliation)
                VALUES (?, ?, ?, ?, ?);
                """,
                (user.name.strip(), email, user.password, user.role, user.affiliation)
            )
            new_id = cursor.lastrowid
            conn.commit()
            return {
                "id": new_id,
                "name": user.name.strip(),
                "email": email,
                "role": user.role,
                "affiliation": user.affiliation
            }
        finally:
            conn.close()


@app.post("/api/auth/login")
def login_user(creds: UserLogin):
    """Authenticate a user and return their profile details."""
    email = creds.email.strip().lower()
    if USE_POSTGRES:
        conn = pg_pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT id, name, email, password_hash, role, affiliation FROM users WHERE email = %s;", (email,))
                user = cur.fetchone()
                if not user or user["password_hash"] != creds.password:
                    raise HTTPException(status_code=401, detail="Invalid email or password.")
                return {
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"],
                    "role": user["role"],
                    "affiliation": user["affiliation"]
                }
        finally:
            pg_pool.putconn(conn)
    else:
        conn = get_sqlite_connection()
        try:
            row = conn.execute("SELECT id, name, email, password_hash, role, affiliation FROM users WHERE email = ?;", (email,)).fetchone()
            if not row or row["password_hash"] != creds.password:
                raise HTTPException(status_code=401, detail="Invalid email or password.")
            return {
                "id": row["id"],
                "name": row["name"],
                "email": row["email"],
                "role": row["role"],
                "affiliation": row["affiliation"]
            }
        finally:
            conn.close()


# ============================================================================
# REST API ENDPOINTS
# ============================================================================

@app.get("/api/health")
def health_check():
    """Returns application health and active database driver status."""
    engine = "postgresql" if USE_POSTGRES else "sqlite"
    recipe_count = 0
    scrap_count = 0

    try:
        if USE_POSTGRES:
            conn = pg_pool.getconn()
            try:
                with conn.cursor() as cur:
                    cur.execute("SELECT COUNT(*) FROM recipes;")
                    recipe_count = cur.fetchone()[0]
                    cur.execute("SELECT COUNT(*) FROM byproduct_scraps;")
                    scrap_count = cur.fetchone()[0]
            finally:
                pg_pool.putconn(conn)
        else:
            conn = get_sqlite_connection()
            try:
                recipe_count = conn.execute("SELECT COUNT(*) FROM recipes;").fetchone()[0]
                scrap_count = conn.execute("SELECT COUNT(*) FROM byproduct_scraps;").fetchone()[0]
            finally:
                conn.close()
    except Exception as e:
        logger.error(f"Health check count error: {e}")

    return {
        "status": "healthy",
        "service": "Annapurna Loop — Community Zero-Waste Edition",
        "database_engine": engine,
        "metrics": {
            "total_recipes": recipe_count,
            "total_byproduct_scraps": scrap_count,
            "platform_mission": "Non-commercial food scrap valorization & surplus NGO dispatch"
        }
    }


@app.get("/api/categories")
def get_categories():
    """Retrieve all food scrap categories (Peels, Stems, Seeds, Grains, Dairy)."""
    if USE_POSTGRES:
        conn = pg_pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT id, name, short_name, icon_svg, description FROM scrap_categories ORDER BY id ASC;")
                return cur.fetchall()
        finally:
            pg_pool.putconn(conn)
    else:
        conn = get_sqlite_connection()
        try:
            rows = conn.execute("SELECT id, name, short_name, icon_svg, description FROM scrap_categories ORDER BY id ASC;").fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()


@app.get("/api/scraps")
def get_scraps(category_id: Optional[int] = None):
    """Retrieve all byproduct scraps with English & regional Indian names."""
    query = """
        SELECT s.id, s.category_id, c.name AS category_name, c.short_name AS category_short, s.name_en, s.name_regional, s.common_uses
        FROM byproduct_scraps s
        JOIN scrap_categories c ON s.category_id = c.id
    """
    params = []
    if category_id:
        query += " WHERE s.category_id = ?" if not USE_POSTGRES else " WHERE s.category_id = %s"
        params.append(category_id)
    query += " ORDER BY s.id ASC;"

    if USE_POSTGRES:
        conn = pg_pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, tuple(params))
                return cur.fetchall()
        finally:
            pg_pool.putconn(conn)
    else:
        conn = get_sqlite_connection()
        try:
            rows = conn.execute(query, params).fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()


@app.get("/api/recipes")
def get_recipes(
    q: Optional[str] = None,
    category_id: Optional[int] = None,
    scrap_id: Optional[int] = None,
    scrap_ids: Optional[str] = None,
    course: Optional[str] = None,
    dietary: Optional[str] = None
):
    """
    Search and filter authentic zero-waste recipes.
    Supports single scrap_id or comma-separated scrap_ids (multi-select).
    """
    conditions = []
    params = []
    param_placeholder = "%s" if USE_POSTGRES else "?"

    if category_id:
        conditions.append(f"s.category_id = {param_placeholder}")
        params.append(int(category_id))

    if scrap_ids and scrap_ids.strip():
        try:
            ids = [int(x.strip()) for x in scrap_ids.split(",") if x.strip()]
            if ids:
                placeholders = ", ".join([param_placeholder] * len(ids))
                conditions.append(f"r.scrap_id IN ({placeholders})")
                params.extend(ids)
        except ValueError:
            pass
    elif scrap_id:
        conditions.append(f"r.scrap_id = {param_placeholder}")
        params.append(int(scrap_id))

    if course and str(course).lower() != "all":
        conditions.append(f"r.course_type = {param_placeholder}")
        params.append(str(course))

    if dietary and str(dietary).lower() != "all":
        conditions.append(f"r.dietary_type = {param_placeholder}")
        params.append(str(dietary))

    if q and q.strip():
        term = f"%{q.strip()}%"
        sub = f"(r.title LIKE {param_placeholder} OR s.name_en LIKE {param_placeholder} OR s.name_regional LIKE {param_placeholder} OR r.chef_wisdom_tip LIKE {param_placeholder} OR r.pantry_staples LIKE {param_placeholder})"
        conditions.append(sub)
        params.extend([term, term, term, term, term])

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""

    query = f"""
        SELECT 
            r.id, r.title, r.scrap_id, s.name_en AS scrap_name_en, s.name_regional AS scrap_name_regional,
            c.id AS category_id, c.name AS category_name, c.short_name AS category_short,
            r.chef_name, r.chef_affiliation, r.prep_time_minutes, r.difficulty,
            r.course_type, r.dietary_type, r.pantry_staples, r.step_by_step_instructions,
            r.chef_wisdom_tip, r.servings, r.created_at
        FROM recipes r
        JOIN byproduct_scraps s ON r.scrap_id = s.id
        JOIN scrap_categories c ON s.category_id = c.id
        {where_clause}
        ORDER BY r.id ASC;
    """

    if USE_POSTGRES:
        conn = pg_pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, tuple(params))
                recipes = cur.fetchall()
                for rc in recipes:
                    if isinstance(rc["pantry_staples"], str):
                        rc["pantry_staples"] = json.loads(rc["pantry_staples"])
                    if isinstance(rc["step_by_step_instructions"], str):
                        rc["step_by_step_instructions"] = json.loads(rc["step_by_step_instructions"])
                return recipes
        finally:
            pg_pool.putconn(conn)
    else:
        conn = get_sqlite_connection()
        try:
            rows = conn.execute(query, params).fetchall()
            recipes = []
            for r in rows:
                item = dict(r)
                if isinstance(item["pantry_staples"], str):
                    try:
                        item["pantry_staples"] = json.loads(item["pantry_staples"])
                    except Exception:
                        item["pantry_staples"] = []
                if isinstance(item["step_by_step_instructions"], str):
                    try:
                        item["step_by_step_instructions"] = json.loads(item["step_by_step_instructions"])
                    except Exception:
                        item["step_by_step_instructions"] = []
                recipes.append(item)
            return recipes
        finally:
            conn.close()


@app.get("/api/recipes/{recipe_id}")
def get_recipe_by_id(recipe_id: int):
    """Retrieve full details of a single recipe by its primary key."""
    query = """
        SELECT 
            r.id, r.title, r.scrap_id, s.name_en AS scrap_name_en, s.name_regional AS scrap_name_regional,
            c.id AS category_id, c.name AS category_name, c.short_name AS category_short,
            r.chef_name, r.chef_affiliation, r.prep_time_minutes, r.difficulty,
            r.course_type, r.dietary_type, r.pantry_staples, r.step_by_step_instructions,
            r.chef_wisdom_tip, r.servings, r.created_at
        FROM recipes r
        JOIN byproduct_scraps s ON r.scrap_id = s.id
        JOIN scrap_categories c ON s.category_id = c.id
        WHERE r.id = ?;
    """ if not USE_POSTGRES else """
        SELECT 
            r.id, r.title, r.scrap_id, s.name_en AS scrap_name_en, s.name_regional AS scrap_name_regional,
            c.id AS category_id, c.name AS category_name, c.short_name AS category_short,
            r.chef_name, r.chef_affiliation, r.prep_time_minutes, r.difficulty,
            r.course_type, r.dietary_type, r.pantry_staples, r.step_by_step_instructions,
            r.chef_wisdom_tip, r.servings, r.created_at
        FROM recipes r
        JOIN byproduct_scraps s ON r.scrap_id = s.id
        JOIN scrap_categories c ON s.category_id = c.id
        WHERE r.id = %s;
    """

    if USE_POSTGRES:
        conn = pg_pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, (recipe_id,))
                rc = cur.fetchone()
                if not rc:
                    raise HTTPException(status_code=404, detail="Recipe not found")
                if isinstance(rc["pantry_staples"], str):
                    rc["pantry_staples"] = json.loads(rc["pantry_staples"])
                if isinstance(rc["step_by_step_instructions"], str):
                    rc["step_by_step_instructions"] = json.loads(rc["step_by_step_instructions"])
                return rc
        finally:
            pg_pool.putconn(conn)
    else:
        conn = get_sqlite_connection()
        try:
            row = conn.execute(query, (recipe_id,)).fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Recipe not found")
            item = dict(row)
            try:
                item["pantry_staples"] = json.loads(item["pantry_staples"])
            except Exception:
                item["pantry_staples"] = []
            try:
                item["step_by_step_instructions"] = json.loads(item["step_by_step_instructions"])
            except Exception:
                item["step_by_step_instructions"] = []
            return item
        finally:
            conn.close()


@app.post("/api/recipes", status_code=status.HTTP_201_CREATED)
def create_recipe(recipe: RecipeCreate):
    """Submit a newly documented zero-waste culinary byproduct recipe."""
    pantry_json = json.dumps(recipe.pantry_staples)
    steps_json = json.dumps(recipe.step_by_step_instructions)

    if USE_POSTGRES:
        conn = pg_pool.getconn()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO recipes (
                        title, scrap_id, chef_name, chef_affiliation, prep_time_minutes,
                        difficulty, course_type, dietary_type, pantry_staples,
                        step_by_step_instructions, chef_wisdom_tip, servings
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id;
                    """,
                    (
                        recipe.title, recipe.scrap_id, recipe.chef_name, recipe.chef_affiliation,
                        recipe.prep_time_minutes, recipe.difficulty, recipe.course_type, recipe.dietary_type,
                        pantry_json, steps_json, recipe.chef_wisdom_tip, recipe.servings
                    )
                )
                new_id = cur.fetchone()[0]
                conn.commit()
                return {"id": new_id, "message": "Recipe successfully preserved into the Annapurna Loop catalog!"}
        except Exception as err:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Database insertion failed: {err}")
        finally:
            pg_pool.putconn(conn)
    else:
        conn = get_sqlite_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO recipes (
                    title, scrap_id, chef_name, chef_affiliation, prep_time_minutes,
                    difficulty, course_type, dietary_type, pantry_staples,
                    step_by_step_instructions, chef_wisdom_tip, servings
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """,
                (
                    recipe.title, recipe.scrap_id, recipe.chef_name, recipe.chef_affiliation,
                    recipe.prep_time_minutes, recipe.difficulty, recipe.course_type, recipe.dietary_type,
                    pantry_json, steps_json, recipe.chef_wisdom_tip, recipe.servings
                )
            )
            new_id = cursor.lastrowid
            conn.commit()
            return {"id": new_id, "message": "Recipe successfully preserved into the Annapurna Loop catalog!"}
        except Exception as err:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Database insertion failed: {err}")
        finally:
            conn.close()


@app.get("/api/dispatches")
def get_dispatches():
    """Retrieve all surplus food dispatch alerts, most recent first."""
    query = """
        SELECT 
            id, recipe_id, dish_name, prepared_by_chef, portions_available,
            pickup_location, contact_number, status, claimed_by_ngo, notes,
            created_at, updated_at
        FROM ngo_dispatches
        ORDER BY 
            CASE WHEN status = 'ACTIVE' THEN 1 ELSE 2 END,
            created_at DESC;
    """
    if USE_POSTGRES:
        conn = pg_pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query)
                return cur.fetchall()
        finally:
            pg_pool.putconn(conn)
    else:
        conn = get_sqlite_connection()
        try:
            rows = conn.execute(query).fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()


@app.post("/api/dispatches", status_code=status.HTTP_201_CREATED)
def create_dispatch(dispatch: DispatchCreate):
    """Broadcast an urgent surplus cooked food alert for community NGO pickup."""
    if USE_POSTGRES:
        conn = pg_pool.getconn()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO ngo_dispatches (
                        dish_name, prepared_by_chef, portions_available,
                        pickup_location, contact_number, notes, recipe_id, status
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, 'ACTIVE')
                    RETURNING id;
                    """,
                    (
                        dispatch.dish_name, dispatch.prepared_by_chef, dispatch.portions_available,
                        dispatch.pickup_location, dispatch.contact_number, dispatch.notes, dispatch.recipe_id
                    )
                )
                new_id = cur.fetchone()[0]
                conn.commit()
                return {"id": new_id, "status": "ACTIVE", "message": "Surplus food broadcast published to NGO community network!"}
        except Exception as err:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to post dispatch: {err}")
        finally:
            pg_pool.putconn(conn)
    else:
        conn = get_sqlite_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO ngo_dispatches (
                    dish_name, prepared_by_chef, portions_available,
                    pickup_location, contact_number, notes, recipe_id, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE');
                """,
                (
                    dispatch.dish_name, dispatch.prepared_by_chef, dispatch.portions_available,
                    dispatch.pickup_location, dispatch.contact_number, dispatch.notes, dispatch.recipe_id
                )
            )
            new_id = cursor.lastrowid
            conn.commit()
            return {"id": new_id, "status": "ACTIVE", "message": "Surplus food broadcast published to NGO community network!"}
        except Exception as err:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to post dispatch: {err}")
        finally:
            conn.close()


@app.patch("/api/dispatches/{dispatch_id}/claim")
def claim_dispatch(dispatch_id: int, claim: DispatchClaim):
    """An authorized NGO or shelter claims an active surplus meal batch."""
    if USE_POSTGRES:
        conn = pg_pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT status FROM ngo_dispatches WHERE id = %s;", (dispatch_id,))
                row = cur.fetchone()
                if not row:
                    raise HTTPException(status_code=404, detail="Dispatch batch not found")
                if row["status"] == "CLAIMED":
                    raise HTTPException(status_code=400, detail="This meal batch has already been claimed by another shelter.")

                cur.execute(
                    """
                    UPDATE ngo_dispatches
                    SET status = 'CLAIMED', claimed_by_ngo = %s, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s;
                    """,
                    (claim.claimed_by_ngo, dispatch_id)
                )
                conn.commit()
                return {"message": f"Successfully claimed meal batch for {claim.claimed_by_ngo}!", "status": "CLAIMED"}
        except HTTPException:
            raise
        except Exception as err:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to claim dispatch: {err}")
        finally:
            pg_pool.putconn(conn)
    else:
        conn = get_sqlite_connection()
        try:
            cursor = conn.cursor()
            row = cursor.execute("SELECT status FROM ngo_dispatches WHERE id = ?;", (dispatch_id,)).fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Dispatch batch not found")
            if row["status"] == "CLAIMED":
                raise HTTPException(status_code=400, detail="This meal batch has already been claimed by another shelter.")

            cursor.execute(
                """
                UPDATE ngo_dispatches
                SET status = 'CLAIMED', claimed_by_ngo = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?;
                """,
                (claim.claimed_by_ngo, dispatch_id)
            )
            conn.commit()
            return {"message": f"Successfully claimed meal batch for {claim.claimed_by_ngo}!", "status": "CLAIMED"}
        except HTTPException:
            raise
        except Exception as err:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to claim dispatch: {err}")
        finally:
            conn.close()


# ============================================================================
# STATIC ASSET SERVING
# ============================================================================

@app.get("/")
def serve_root():
    """Serves the pure HTML5 application entry point."""
    index_path = BASE_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    return {"message": "Annapurna Loop API is running. Please place index.html in the root directory."}


@app.get("/style.css")
def serve_style():
    """Serves pure CSS3 stylesheets."""
    css_path = BASE_DIR / "style.css"
    if css_path.exists():
        return FileResponse(css_path, media_type="text/css")
    raise HTTPException(status_code=404, detail="style.css not found")


@app.get("/app.js")
def serve_app_js():
    """Serves pure modern Vanilla JavaScript application code."""
    js_path = BASE_DIR / "app.js"
    if js_path.exists():
        return FileResponse(js_path, media_type="application/javascript")
    raise HTTPException(status_code=404, detail="app.js not found")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    logger.info(f"Starting Annapurna Loop community server on http://localhost:{port}")
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
