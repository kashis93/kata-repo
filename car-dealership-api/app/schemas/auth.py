"""Pydantic schemas for authentication requests and responses."""

from pydantic import BaseModel, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    """Payload for user registration."""

    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        """
        Ensure passwords meet a minimum complexity requirement.

        Args:
            value: Raw password string.

        Returns:
            str: Validated password.

        Raises:
            ValueError: If the password is too weak.
        """
        if value.strip() != value:
            raise ValueError("Password must not contain leading or trailing spaces")
        return value


class LoginRequest(BaseModel):
    """Payload for email/password login."""

    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class TokenResponse(BaseModel):
    """OAuth2-style access token response."""

    access_token: str
    token_type: str = "bearer"
