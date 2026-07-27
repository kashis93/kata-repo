"""Pydantic schemas for vehicle requests and responses."""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class VehicleCreate(BaseModel):
    """Payload for creating a new vehicle."""

    make: str = Field(min_length=1, max_length=100)
    model: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=100)
    price: Decimal = Field(gt=Decimal("0"))
    quantity: int = Field(ge=0, default=0)

    @field_validator("price")
    @classmethod
    def normalize_price(cls, value: Decimal) -> Decimal:
        """
        Normalize monetary values to two decimal places.

        Args:
            value: Raw price from the client.

        Returns:
            Decimal: Price quantized to cents.
        """
        return value.quantize(Decimal("0.01"))


class VehicleUpdate(BaseModel):
    """Payload for partial vehicle updates."""

    make: str | None = Field(default=None, min_length=1, max_length=100)
    model: str | None = Field(default=None, min_length=1, max_length=100)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    price: Decimal | None = Field(default=None, gt=Decimal("0"))
    quantity: int | None = Field(default=None, ge=0)

    @field_validator("price")
    @classmethod
    def normalize_price(cls, value: Decimal | None) -> Decimal | None:
        """
        Normalize optional price updates to two decimal places.

        Args:
            value: Optional price from the client.

        Returns:
            Decimal | None: Quantized price or None.
        """
        if value is None:
            return None
        return value.quantize(Decimal("0.01"))


class VehicleResponse(BaseModel):
    """Vehicle data returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    make: str
    model: str
    category: str
    price: Decimal
    quantity: int
    created_at: datetime
    updated_at: datetime


class RestockRequest(BaseModel):
    """Payload for admin restock operations."""

    amount: int = Field(gt=0, description="Number of units to add to inventory.")
