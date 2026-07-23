"""Vehicle API endpoints for inventory management."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from decimal import Decimal

from app.api.deps import get_current_user, get_current_admin_user
from app.db.session import get_db
from app.schemas.user import UserResponse
from app.schemas.vehicle import RestockRequest, VehicleCreate, VehicleResponse, VehicleUpdate
from app.services.vehicle_service import (
    create_vehicle,
    delete_vehicle,
    get_all_vehicles,
    get_vehicle_by_id,
    purchase_vehicle,
    restock_vehicle,
    update_vehicle,
    search_vehicles,
)

router = APIRouter()


@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle_endpoint(
    data: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_admin_user),
):
    """
    Create a new vehicle in inventory.

    Requires authentication.
    """
    return create_vehicle(db, data)


@router.get("", response_model=list[VehicleResponse])
def list_vehicles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    List all vehicles with pagination.

    - **skip**: Number of records to skip (default 0)
    - **limit**: Maximum records to return (default 100, max 100)
    """
    return get_all_vehicles(db, skip=skip, limit=limit)


@router.get("/search", response_model=list[VehicleResponse])
def search_vehicles_endpoint(
    make: str | None = Query(None, min_length=1),
    model: str | None = Query(None, min_length=1),
    category: str | None = Query(None, min_length=1),
    min_price: Decimal | None = Query(None, ge=0),
    max_price: Decimal | None = Query(None, ge=0),
    db: Session = Depends(get_db),
):
    """
    Search for vehicles by make, model, category, or price range.
    """
    return search_vehicles(
        db,
        make=make,
        model=model,
        category=category,
        min_price=float(min_price) if min_price is not None else None,
        max_price=float(max_price) if max_price is not None else None,
    )


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
):
    """
    Get a specific vehicle by ID.

    - **vehicle_id**: The vehicle's primary key
    """
    vehicle = get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )
    return vehicle


@router.patch("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle_endpoint(
    vehicle_id: int,
    data: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_admin_user),
):
    """
    Update a vehicle's details (partial update).

    Requires admin privileges.
    """
    vehicle = update_vehicle(db, vehicle_id, data)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def put_vehicle_endpoint(
    vehicle_id: int,
    data: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_admin_user),
):
    """
    Update a vehicle's details (full/partial update).

    Requires admin privileges.
    """
    vehicle = update_vehicle(db, vehicle_id, data)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )
    return vehicle


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle_endpoint(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_admin_user),
):
    """
    Delete a vehicle from inventory.

    Requires admin privileges.
    """
    success = delete_vehicle(db, vehicle_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )


@router.post("/{vehicle_id}/restock", response_model=VehicleResponse)
def restock_vehicle_endpoint(
    vehicle_id: int,
    data: RestockRequest,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_admin_user),
):
    """
    Add stock to a vehicle (admin operation).

    Requires admin privileges.
    - **amount**: Number of units to add (must be positive)
    """
    vehicle = restock_vehicle(db, vehicle_id, data)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )
    return vehicle


@router.post("/{vehicle_id}/purchase", response_model=VehicleResponse)
def purchase_vehicle_endpoint(
    vehicle_id: int,
    quantity: int = Query(1, ge=1),
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Purchase a vehicle (decrease quantity).

    Requires authentication.
    - **quantity**: Number of units to purchase (default 1)
    """
    try:
        vehicle = purchase_vehicle(db, vehicle_id, quantity)
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found",
            )
        return vehicle
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
