"""Data-access functions for Vehicle entities."""

from decimal import Decimal

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle


def get_by_id(db: Session, vehicle_id: int) -> Vehicle | None:
    """
    Fetch a vehicle by primary key.

    Args:
        db: Active SQLAlchemy session.
        vehicle_id: Vehicle identifier.

    Returns:
        Vehicle | None: Matching vehicle or None.
    """
    return db.get(Vehicle, vehicle_id)


def list_all(db: Session) -> list[Vehicle]:
    """
    Return all vehicles ordered by id ascending.

    Args:
        db: Active SQLAlchemy session.

    Returns:
        list[Vehicle]: All vehicles in the database.
    """
    statement: Select[tuple[Vehicle]] = select(Vehicle).order_by(Vehicle.id.asc())
    return list(db.scalars(statement).all())


def create(
    db: Session,
    make: str,
    model: str,
    category: str,
    price: Decimal,
    quantity: int,
) -> Vehicle:
    """
    Persist a new vehicle record.

    Args:
        db: Active SQLAlchemy session.
        make: Vehicle manufacturer.
        model: Vehicle model name.
        category: Vehicle category label.
        price: Unit price as Decimal.
        quantity: Initial stock quantity.

    Returns:
        Vehicle: Newly created vehicle instance.
    """
    vehicle: Vehicle = Vehicle(
        make=make,
        model=model,
        category=category,
        price=price,
        quantity=quantity,
    )
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


def update(db: Session, vehicle: Vehicle, data: dict[str, object]) -> Vehicle:
    """
    Apply partial field updates to an existing vehicle.

    Args:
        db: Active SQLAlchemy session.
        vehicle: Vehicle instance to update.
        data: Mapping of field names to new values.

    Returns:
        Vehicle: Updated vehicle instance.
    """
    for field_name, field_value in data.items():
        setattr(vehicle, field_name, field_value)
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


def delete(db: Session, vehicle: Vehicle) -> None:
    """
    Remove a vehicle from the database.

    Args:
        db: Active SQLAlchemy session.
        vehicle: Vehicle instance to delete.

    Returns:
        None
    """
    db.delete(vehicle)
    db.commit()


def search(
    db: Session,
    make: str | None = None,
    model: str | None = None,
    category: str | None = None,
    min_price: Decimal | None = None,
    max_price: Decimal | None = None,
) -> list[Vehicle]:
    """
    Search vehicles using optional filters.

    Args:
        db: Active SQLAlchemy session.
        make: Optional make filter (substring match).
        model: Optional model filter (substring match).
        category: Optional category filter (substring match).
        min_price: Optional minimum unit price inclusive.
        max_price: Optional maximum unit price inclusive.

    Returns:
        list[Vehicle]: Vehicles matching all supplied filters.
    """
    statement: Select[tuple[Vehicle]] = select(Vehicle)
    if make is not None:
        statement = statement.where(Vehicle.make.ilike(f"%{make}%"))
    if model is not None:
        statement = statement.where(Vehicle.model.ilike(f"%{model}%"))
    if category is not None:
        statement = statement.where(Vehicle.category.ilike(f"%{category}%"))
    if min_price is not None:
        statement = statement.where(Vehicle.price >= min_price)
    if max_price is not None:
        statement = statement.where(Vehicle.price <= max_price)
    statement = statement.order_by(Vehicle.id.asc())
    return list(db.scalars(statement).all())


def decrement_quantity(db: Session, vehicle: Vehicle) -> Vehicle:
    """
    Decrease vehicle quantity by one and persist.

    Args:
        db: Active SQLAlchemy session.
        vehicle: Vehicle to update.

    Returns:
        Vehicle: Updated vehicle with decremented quantity.
    """
    vehicle.quantity -= 1
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


def increment_quantity(db: Session, vehicle: Vehicle, amount: int) -> Vehicle:
    """
    Increase vehicle quantity by the given amount and persist.

    Args:
        db: Active SQLAlchemy session.
        vehicle: Vehicle to update.
        amount: Positive number of units to add.

    Returns:
        Vehicle: Updated vehicle with incremented quantity.
    """
    vehicle.quantity += amount
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle
