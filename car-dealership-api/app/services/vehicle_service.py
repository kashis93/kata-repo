"""Vehicle business logic for inventory management."""

from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.schemas.vehicle import RestockRequest, VehicleCreate, VehicleUpdate


def create_vehicle(db: Session, data: VehicleCreate) -> Vehicle:
    """
    Create a new vehicle in inventory.

    Args:
        db: Database session.
        data: Vehicle creation payload.

    Returns:
        Vehicle: The newly created vehicle instance.
    """
    new_vehicle = Vehicle(
        make=data.make,
        model=data.model,
        category=data.category,
        price=data.price,
        quantity=data.quantity,
    )
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    return new_vehicle


def get_vehicle_by_id(db: Session, vehicle_id: int) -> Vehicle | None:
    """
    Retrieve a vehicle by its ID.

    Args:
        db: Database session.
        vehicle_id: The vehicle's primary key.

    Returns:
        Vehicle | None: The vehicle if found, otherwise None.
    """
    return db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()


def get_all_vehicles(db: Session, skip: int = 0, limit: int = 100) -> list[Vehicle]:
    """
    Retrieve all vehicles with pagination.

    Args:
        db: Database session.
        skip: Number of records to skip.
        limit: Maximum number of records to return.

    Returns:
        list[Vehicle]: List of vehicle instances.
    """
    return db.query(Vehicle).offset(skip).limit(limit).all()


def update_vehicle(db: Session, vehicle_id: int, data: VehicleUpdate) -> Vehicle | None:
    """
    Update a vehicle's details.

    Args:
        db: Database session.
        vehicle_id: The vehicle's primary key.
        data: Vehicle update payload with optional fields.

    Returns:
        Vehicle | None: The updated vehicle if found, otherwise None.
    """
    vehicle = get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vehicle, field, value)

    db.commit()
    db.refresh(vehicle)
    return vehicle


def delete_vehicle(db: Session, vehicle_id: int) -> bool:
    """
    Delete a vehicle from inventory.

    Args:
        db: Database session.
        vehicle_id: The vehicle's primary key.

    Returns:
        bool: True if deleted, False if not found.
    """
    vehicle = get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        return False

    db.delete(vehicle)
    db.commit()
    return True


def restock_vehicle(db: Session, vehicle_id: int, data: RestockRequest) -> Vehicle | None:
    """
    Add stock to a vehicle (admin operation).

    Args:
        db: Database session.
        vehicle_id: The vehicle's primary key.
        data: Restock payload with amount to add.

    Returns:
        Vehicle | None: The updated vehicle if found, otherwise None.
    """
    vehicle = get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        return None

    vehicle.quantity += data.amount
    db.commit()
    db.refresh(vehicle)
    return vehicle


def purchase_vehicle(db: Session, vehicle_id: int, quantity: int = 1) -> Vehicle | None:
    """
    Purchase a vehicle (decrease quantity).

    Args:
        db: Database session.
        vehicle_id: The vehicle's primary key.
        quantity: Number of units to purchase (default 1).

    Returns:
        Vehicle | None: The updated vehicle if successful, None if insufficient stock.

    Raises:
        ValueError: If insufficient stock available.
    """
    vehicle = get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        return None

    if vehicle.quantity < quantity:
        raise ValueError(f"Insufficient stock. Available: {vehicle.quantity}, Requested: {quantity}")

    vehicle.quantity -= quantity
    db.commit()
    db.refresh(vehicle)
    return vehicle


def search_vehicles(
    db: Session,
    make: str | None = None,
    model: str | None = None,
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
) -> list[Vehicle]:
    """
    Search for vehicles based on make, model, category, or price range.

    Args:
        db: Database session.
        make: Substring search for manufacturer.
        model: Substring search for model name.
        category: Substring search for category.
        min_price: Minimum unit price filter.
        max_price: Maximum unit price filter.

    Returns:
        list[Vehicle]: Match results.
    """
    query = db.query(Vehicle)
    if make:
        query = query.filter(Vehicle.make.ilike(f"%{make}%"))
    if model:
        query = query.filter(Vehicle.model.ilike(f"%{model}%"))
    if category:
        query = query.filter(Vehicle.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price <= max_price)
    return query.order_by(Vehicle.id.asc()).all()
