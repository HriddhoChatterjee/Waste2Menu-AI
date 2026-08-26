"""
KitchenOS Common FastAPI Dependencies
=====================================
Database session and configuration dependencies for clean dependency injection.
"""

from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import Session

from app.config import Settings, get_settings
from app.database import get_db

# Type-annotated dependency aliases for clean route handler signatures
DBSession = Annotated[Session, Depends(get_db)]
AppSettings = Annotated[Settings, Depends(get_settings)]
