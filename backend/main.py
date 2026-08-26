"""
KitchenOS - Automated Kitchen Prep-Scrap Tracking & Menu Generation API
========================================================================
Main FastAPI application entry point, lifecycle management, CORS configuration,
and exception handling.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import Any, Dict

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import Base, SessionLocal, engine
from app.routers import analytics, fallback, pos, recipes, scrap
from app.services.seeder import seed_initial_data

# Configure Structured Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
)
logger = logging.getLogger("kitchenos")
settings = get_settings()


# ─────────────────────────────────────────────────────────────────────────────
# Application Lifespan (Startup & Shutdown)
# ─────────────────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager:
    1. Creates all database tables via SQLAlchemy metadata if they don't exist.
    2. Seeds initial demo data (Ingredients, Recipes, NGOs, Historical Scrap) if empty.
    """
    logger.info("Initializing KitchenOS Database & Schema...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")

    # Seed initial demo data
    with SessionLocal() as db:
        seed_initial_data(db)

    yield

    logger.info("KitchenOS shutting down.")
    engine.dispose()


# ─────────────────────────────────────────────────────────────────────────────
# FastAPI Application Instantiation
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Production-grade backend for Automated Kitchen Prep-Scrap Tracking, "
        "Reverse Recipe Formulation via PuLP Integer Linear Programming (ILP), "
        "POS order processing, and automated NGO redistribution fallback."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)


# ─────────────────────────────────────────────────────────────────────────────
# CORS Middleware
# ─────────────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────────────────────
# Global Exception Handlers
# ─────────────────────────────────────────────────────────────────────────────

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catches unhandled errors to avoid leaking internal tracebacks to clients."""
    logger.exception("Unhandled server exception on %s %s: %s", request.method, request.url.path, str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please contact the kitchen system administrator."},
    )


# ─────────────────────────────────────────────────────────────────────────────
# Router Inclusions (All 5 Domain Modules)
# ─────────────────────────────────────────────────────────────────────────────

app.include_router(scrap.router, prefix=settings.API_V1_STR)
app.include_router(recipes.router, prefix=settings.API_V1_STR)
app.include_router(pos.router, prefix=settings.API_V1_STR)
app.include_router(fallback.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)


# ─────────────────────────────────────────────────────────────────────────────
# Core System Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/", tags=["System"], summary="API Root & Status")
async def api_root() -> Dict[str, Any]:
    """Root endpoint exposing API metadata, operational status, and documentation URLs."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs": "/docs",
        "redoc": "/redoc",
        "openapi": "/openapi.json",
    }


@app.get("/health", tags=["System"], summary="Health Check")
async def health_check() -> Dict[str, str]:
    """Liveness probe verifying that the API service is alive and healthy."""
    return {"status": "healthy"}
