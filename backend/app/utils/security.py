"""
KitchenOS Security & OTP Generation Utilities
=============================================
Cryptographically secure random number and OTP generation using Python's secrets module.
"""

from __future__ import annotations

import secrets


def generate_secure_otp() -> str:
    """
    Generates a cryptographically strong 6-digit numeric OTP in the range [100000, 999999].
    Uses the system's cryptographically secure pseudo-random number generator (CSPRNG).
    """
    return str(secrets.randbelow(900000) + 100000)
