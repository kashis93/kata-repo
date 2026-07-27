"""Password hashing and JWT token utilities."""

import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt

from app.core.config import settings


def hash_password(plain_password: str) -> str:
    """
    Hash a plain-text password using bcrypt.

    Args:
        plain_password: Raw password supplied by the user.

    Returns:
        str: Bcrypt password hash safe for persistence.
    """
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain_password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain-text password against a stored bcrypt hash.

    Args:
        plain_password: Raw password to verify.
        hashed_password: Stored bcrypt hash.

    Returns:
        bool: True if the password matches, otherwise False.
    """
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8"),
        )
    except Exception:
        return False


def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    """
    Create a signed JWT access token with an expiration claim.

    Args:
        subject: Identifier stored in the `sub` claim (typically user id).
        expires_delta: Optional custom lifetime; defaults to settings value.

    Returns:
        str: Encoded JWT access token.
    """
    expire: datetime = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta is not None
        else timedelta(minutes=settings.access_token_expire_minutes)
    )
    payload: dict[str, Any] = {"sub": subject, "exp": expire}
    encoded_jwt: str = jwt.encode(
        payload,
        settings.secret_key,
        algorithm=settings.algorithm,
    )
    return encoded_jwt


def decode_access_token(token: str) -> dict[str, Any]:
    """
    Decode and validate a JWT access token.

    Args:
        token: Bearer token string from the Authorization header.

    Returns:
        dict[str, Any]: Decoded JWT payload.

    Raises:
        JWTError: If the token is invalid or expired.
    """
    return jwt.decode(
        token,
        settings.secret_key,
        algorithms=[settings.algorithm],
    )
