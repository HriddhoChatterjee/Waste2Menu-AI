"""NGO Partner & Dispatch router — OTP generation and verification."""

from __future__ import annotations

import random
import string
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import get_settings
from app.database import get_db
from app.models import NGODispatch, NGOPartner, NGOStatus
from app.schemas import (
    MessageResponse,
    NGODispatchCreate,
    NGODispatchOut,
    NGOPartnerCreate,
    NGOPartnerOut,
    OTPVerifyRequest,
    OTPVerifyResponse,
)

router = APIRouter(prefix="/ngo", tags=["NGO Portal"])
DB = Annotated[AsyncSession, Depends(get_db)]
settings = get_settings()


def _generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


# ── Partners ─────────────────────────────────────────────────────────────────

@router.get("/partners", response_model=list[NGOPartnerOut])
async def list_partners(
    db: DB,
    active_only: bool = True,
) -> list[NGOPartnerOut]:
    stmt = select(NGOPartner)
    if active_only:
        stmt = stmt.where(NGOPartner.is_active == True)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.post("/partners", response_model=NGOPartnerOut, status_code=201)
async def create_partner(body: NGOPartnerCreate, db: DB) -> NGOPartnerOut:
    partner = NGOPartner(**body.model_dump())
    db.add(partner)
    await db.flush()
    await db.refresh(partner)
    return partner


@router.get("/partners/{partner_id}", response_model=NGOPartnerOut)
async def get_partner(partner_id: int, db: DB) -> NGOPartnerOut:
    p = await db.get(NGOPartner, partner_id)
    if not p:
        raise HTTPException(status_code=404, detail="NGO partner not found.")
    return p


@router.delete("/partners/{partner_id}", response_model=MessageResponse)
async def delete_partner(partner_id: int, db: DB) -> MessageResponse:
    p = await db.get(NGOPartner, partner_id)
    if not p:
        raise HTTPException(status_code=404, detail="NGO partner not found.")
    p.is_active = False  # Soft delete
    return MessageResponse(message=f"NGO partner {partner_id} deactivated.")


# ── Dispatches ────────────────────────────────────────────────────────────────

async def _load_dispatch(dispatch_id: int, db: AsyncSession) -> NGODispatch:
    stmt = (
        select(NGODispatch)
        .where(NGODispatch.id == dispatch_id)
        .options(selectinload(NGODispatch.ngo))
    )
    result = await db.execute(stmt)
    d = result.scalars().first()
    if not d:
        raise HTTPException(status_code=404, detail="NGO dispatch not found.")
    return d


@router.get("/dispatches", response_model=list[NGODispatchOut])
async def list_dispatches(
    db: DB,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    ngo_id: int | None = None,
    status: NGOStatus | None = None,
) -> list[NGODispatchOut]:
    stmt = (
        select(NGODispatch)
        .options(selectinload(NGODispatch.ngo))
        .order_by(desc(NGODispatch.created_at))
        .offset(skip).limit(limit)
    )
    if ngo_id:
        stmt = stmt.where(NGODispatch.ngo_id == ngo_id)
    if status:
        stmt = stmt.where(NGODispatch.status == status)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.post("/dispatches", response_model=NGODispatchOut, status_code=201)
async def create_dispatch(body: NGODispatchCreate, db: DB) -> NGODispatchOut:
    """Create a dispatch and generate a unique 6-digit OTP."""
    ngo = await db.get(NGOPartner, body.ngo_id)
    if not ngo or not ngo.is_active:
        raise HTTPException(status_code=404, detail="Active NGO partner not found.")

    otp = _generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

    dispatch = NGODispatch(
        **body.model_dump(),
        otp_code=otp,
        otp_expires_at=expires_at,
        status=NGOStatus.PENDING,
    )
    db.add(dispatch)
    await db.flush()
    return await _load_dispatch(dispatch.id, db)


@router.get("/dispatches/{dispatch_id}", response_model=NGODispatchOut)
async def get_dispatch(dispatch_id: int, db: DB) -> NGODispatchOut:
    return await _load_dispatch(dispatch_id, db)


@router.post("/dispatches/verify-otp", response_model=OTPVerifyResponse)
async def verify_otp(body: OTPVerifyRequest, db: DB) -> OTPVerifyResponse:
    """
    Verify OTP submitted by an NGO driver at pickup.
    On success: marks dispatch as COLLECTED.
    """
    dispatch = await _load_dispatch(body.dispatch_id, db)

    if dispatch.status == NGOStatus.COLLECTED:
        return OTPVerifyResponse(
            success=False,
            message="This dispatch has already been collected.",
            dispatch=dispatch,
        )
    if dispatch.status == NGOStatus.EXPIRED:
        return OTPVerifyResponse(success=False, message="Dispatch OTP has expired.")

    now = datetime.now(timezone.utc)
    if dispatch.otp_expires_at and now > dispatch.otp_expires_at:
        dispatch.status = NGOStatus.EXPIRED
        return OTPVerifyResponse(success=False, message="OTP has expired.")

    if dispatch.otp_code != body.otp_code:
        return OTPVerifyResponse(success=False, message="Invalid OTP code.")

    dispatch.status = NGOStatus.COLLECTED
    dispatch.collected_at = now
    await db.flush()
    reloaded = await _load_dispatch(dispatch.id, db)
    return OTPVerifyResponse(
        success=True,
        message="OTP verified. Dispatch marked as collected. ✅",
        dispatch=reloaded,
    )


@router.post("/dispatches/{dispatch_id}/regenerate-otp", response_model=NGODispatchOut)
async def regenerate_otp(dispatch_id: int, db: DB) -> NGODispatchOut:
    """Re-issue a fresh OTP if the previous one expired."""
    dispatch = await db.get(NGODispatch, dispatch_id)
    if not dispatch:
        raise HTTPException(status_code=404, detail="NGO dispatch not found.")
    if dispatch.status == NGOStatus.COLLECTED:
        raise HTTPException(status_code=409, detail="Dispatch already collected.")

    dispatch.otp_code = _generate_otp()
    dispatch.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    dispatch.status = NGOStatus.PENDING
    await db.flush()
    return await _load_dispatch(dispatch_id, db)
