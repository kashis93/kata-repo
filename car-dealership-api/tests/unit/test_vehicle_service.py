"""
Unit tests for vehicle inventory management service functions.
"""

from decimal import Decimal
import pytest
from sqlalchemy.orm import Session

from app.schemas.vehicle import RestockRequest, VehicleCreate, VehicleUpdate
from app.services.vehicle_service import (
    create_vehicle,
    get_vehicle_by_id,
    get_all_vehicles,
    update_vehicle,
    delete_vehicle,
    restock_vehicle,
    purchase_vehicle,
    search_vehicles,
)
from app.models.vehicle import Vehicle


def test_create_vehicle(db: Session) -> None:
    """Creating a vehicle should persist in database."""
    req = VehicleCreate(
        make="Honda",
        model="Civic",
        category="Sedan",
        price=Decimal("22000.00"),
        quantity=3,
    )
    vehicle = create_vehicle(db, req)

    assert vehicle.id is not None
    assert vehicle.make == "Honda"
    assert vehicle.model == "Civic"
    assert vehicle.price == Decimal("22000.00")
    assert vehicle.quantity == 3


def test_get_vehicle_by_id(db: Session) -> None:
    """Fetching a vehicle should return the instance or None."""
    req = VehicleCreate(
        make="Honda",
        model="Civic",
        category="Sedan",
        price=Decimal("22000.00"),
        quantity=3,
    )
    vehicle = create_vehicle(db, req)

    found = get_vehicle_by_id(db, vehicle.id)
    assert found is not None
    assert found.model == "Civic"

    not_found = get_vehicle_by_id(db, 9999)
    assert not_found is None


def test_get_all_vehicles(db: Session) -> None:
    """Fetching all vehicles should return the list with pagination."""
    req1 = VehicleCreate(make="A", model="A", category="Sedan", price=Decimal("100"), quantity=1)
    req2 = VehicleCreate(make="B", model="B", category="Sedan", price=Decimal("200"), quantity=2)
    create_vehicle(db, req1)
    create_vehicle(db, req2)

    vehicles = get_all_vehicles(db, skip=0, limit=100)
    assert len(vehicles) == 2

    page = get_all_vehicles(db, skip=1, limit=1)
    assert len(page) == 1
    assert page[0].make == "B"


def test_update_vehicle(db: Session) -> None:
    """Updating a vehicle should apply patch correctly."""
    req = VehicleCreate(make="Honda", model="Civic", category="Sedan", price=Decimal("22000"), quantity=3)
    vehicle = create_vehicle(db, req)

    update_req = VehicleUpdate(price=Decimal("23000.50"), quantity=5)
    updated = update_vehicle(db, vehicle.id, update_req)

    assert updated is not None
    assert updated.price == Decimal("23000.50")
    assert updated.quantity == 5
    assert updated.make == "Honda"  # unchanged


def test_delete_vehicle(db: Session) -> None:
    """Deleting a vehicle should remove it from database."""
    req = VehicleCreate(make="Honda", model="Civic", category="Sedan", price=Decimal("22000"), quantity=3)
    vehicle = create_vehicle(db, req)

    success = delete_vehicle(db, vehicle.id)
    assert success is True

    found = get_vehicle_by_id(db, vehicle.id)
    assert found is None

    # Deleting non-existent should return False
    assert delete_vehicle(db, 9999) is False


def test_restock_vehicle(db: Session) -> None:
    """Restocking should increase the quantity."""
    req = VehicleCreate(make="Honda", model="Civic", category="Sedan", price=Decimal("22000"), quantity=3)
    vehicle = create_vehicle(db, req)

    restock_req = RestockRequest(amount=4)
    updated = restock_vehicle(db, vehicle.id, restock_req)

    assert updated is not None
    assert updated.quantity == 7


def test_purchase_vehicle_success(db: Session) -> None:
    """Purchasing should decrease the quantity if stock is available."""
    req = VehicleCreate(make="Honda", model="Civic", category="Sedan", price=Decimal("22000"), quantity=3)
    vehicle = create_vehicle(db, req)

    updated = purchase_vehicle(db, vehicle.id, quantity=2)
    assert updated is not None
    assert updated.quantity == 1


def test_purchase_vehicle_insufficient_stock_fails(db: Session) -> None:
    """Purchasing more than available stock should raise ValueError."""
    req = VehicleCreate(make="Honda", model="Civic", category="Sedan", price=Decimal("22000"), quantity=3)
    vehicle = create_vehicle(db, req)

    with pytest.raises(ValueError) as excinfo:
        purchase_vehicle(db, vehicle.id, quantity=4)
    assert "Insufficient stock" in str(excinfo.value)


def test_search_vehicles(db: Session) -> None:
    """Searching vehicles should filter accurately."""
    req1 = VehicleCreate(make="Toyota", model="Camry", category="Sedan", price=Decimal("25000"), quantity=5)
    req2 = VehicleCreate(make="Toyota", model="Rav4", category="SUV", price=Decimal("30000"), quantity=3)
    req3 = VehicleCreate(make="Ford", model="Mustang", category="Coupe", price=Decimal("45000"), quantity=2)
    create_vehicle(db, req1)
    create_vehicle(db, req2)
    create_vehicle(db, req3)

    # Search by make
    res_make = search_vehicles(db, make="Toyota")
    assert len(res_make) == 2

    # Search by category
    res_cat = search_vehicles(db, category="SUV")
    assert len(res_cat) == 1
    assert res_cat[0].model == "Rav4"

    # Search by price range
    res_price = search_vehicles(db, min_price=Decimal("28000"), max_price=Decimal("50000"))
    assert len(res_price) == 2  # Rav4 and Mustang
