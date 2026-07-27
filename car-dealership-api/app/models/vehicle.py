"""SQLAlchemy model representing a vehicle in dealership inventory."""

from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import DateTime, Numeric, String, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Vehicle(Base):
    """
    Represents a vehicle available at the dealership.

    Note: `quantity` must never go negative. This is NOT enforced at
    the database level — it is enforced in `services/vehicle_service.py`
    before any purchase/restock operation is committed.
    """

    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    make: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    model: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<Vehicle id={self.id} make={self.make} model={self.model} qty={self.quantity}>"