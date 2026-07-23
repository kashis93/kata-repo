"""
Integration tests for the Vehicles inventory management endpoints.
"""

from decimal import Decimal
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle


def test_api_list_vehicles_auth_required(client: TestClient) -> None:
    """GET /api/vehicles should return 401 Unauthorized without credentials."""
    resp = client.get("/api/vehicles")
    assert resp.status_code == 401


def test_api_list_vehicles_success(
    client: TestClient,
    db: Session,
    user_headers: dict[str, str],
) -> None:
    """GET /api/vehicles should return all vehicles for authenticated user."""
    # Seed a vehicle
    vehicle = Vehicle(make="Toyota", model="Corolla", category="Sedan", price=Decimal("20000.00"), quantity=4)
    db.add(vehicle)
    db.commit()

    resp = client.get("/api/vehicles", headers=user_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["model"] == "Corolla"


def test_api_create_vehicle_admin_only(
    client: TestClient,
    user_headers: dict[str, str],
    admin_headers: dict[str, str],
    db: Session,
) -> None:
    """POST /api/vehicles is restricted to admins."""
    payload = {"make": "Mazda", "model": "CX-5", "category": "SUV", "price": 28000.00, "quantity": 3}

    # Customer user fails (403 Forbidden)
    resp_user = client.post("/api/vehicles", json=payload, headers=user_headers)
    assert resp_user.status_code == 403

    # Admin user succeeds (201 Created)
    resp_admin = client.post("/api/vehicles", json=payload, headers=admin_headers)
    assert resp_admin.status_code == 201
    assert resp_admin.json()["model"] == "CX-5"

    # Verify db entry
    assert db.query(Vehicle).filter(Vehicle.model == "CX-5").first() is not None


def test_api_get_vehicle_by_id(
    client: TestClient,
    db: Session,
    user_headers: dict[str, str],
) -> None:
    """GET /api/vehicles/{id} returns vehicle details for authenticated user."""
    vehicle = Vehicle(make="Nissan", model="Altima", category="Sedan", price=Decimal("24000.00"), quantity=2)
    db.add(vehicle)
    db.commit()

    resp = client.get(f"/api/vehicles/{vehicle.id}", headers=user_headers)
    assert resp.status_code == 200
    assert resp.json()["model"] == "Altima"

    # Non-existent vehicle returns 404
    resp_404 = client.get("/api/vehicles/9999", headers=user_headers)
    assert resp_404.status_code == 404


def test_api_update_vehicle_admin_only(
    client: TestClient,
    db: Session,
    user_headers: dict[str, str],
    admin_headers: dict[str, str],
) -> None:
    """PUT & PATCH /api/vehicles/{id} are restricted to admins."""
    vehicle = Vehicle(make="Nissan", model="Altima", category="Sedan", price=Decimal("24000.00"), quantity=2)
    db.add(vehicle)
    db.commit()

    payload = {"price": 25000.00, "quantity": 4}

    # PUT Customer fails (403)
    resp_put_user = client.put(f"/api/vehicles/{vehicle.id}", json=payload, headers=user_headers)
    assert resp_put_user.status_code == 403

    # PUT Admin succeeds (200)
    resp_put_admin = client.put(f"/api/vehicles/{vehicle.id}", json=payload, headers=admin_headers)
    assert resp_put_admin.status_code == 200
    assert resp_put_admin.json()["price"] == "25000.00"
    assert resp_put_admin.json()["quantity"] == 4

    # PATCH Admin succeeds (200)
    patch_payload = {"quantity": 10}
    resp_patch_admin = client.patch(f"/api/vehicles/{vehicle.id}", json=patch_payload, headers=admin_headers)
    assert resp_patch_admin.status_code == 200
    assert resp_patch_admin.json()["quantity"] == 10


def test_api_delete_vehicle_admin_only(
    client: TestClient,
    db: Session,
    user_headers: dict[str, str],
    admin_headers: dict[str, str],
) -> None:
    """DELETE /api/vehicles/{id} is restricted to admins."""
    vehicle = Vehicle(make="Subaru", model="Outback", category="Wagon", price=Decimal("32000.00"), quantity=1)
    db.add(vehicle)
    db.commit()

    # Customer fails (403)
    resp_user = client.delete(f"/api/vehicles/{vehicle.id}", headers=user_headers)
    assert resp_user.status_code == 403

    # Admin succeeds (204)
    resp_admin = client.delete(f"/api/vehicles/{vehicle.id}", headers=admin_headers)
    assert resp_admin.status_code == 204

    # Check database
    assert db.query(Vehicle).filter(Vehicle.id == vehicle.id).first() is None


def test_api_restock_vehicle_admin_only(
    client: TestClient,
    db: Session,
    user_headers: dict[str, str],
    admin_headers: dict[str, str],
) -> None:
    """POST /api/vehicles/{id}/restock is restricted to admins."""
    vehicle = Vehicle(make="Toyota", model="Supra", category="Sports", price=Decimal("55000.00"), quantity=1)
    db.add(vehicle)
    db.commit()

    payload = {"amount": 5}

    # Customer fails (403)
    resp_user = client.post(f"/api/vehicles/{vehicle.id}/restock", json=payload, headers=user_headers)
    assert resp_user.status_code == 403

    # Admin succeeds (200)
    resp_admin = client.post(f"/api/vehicles/{vehicle.id}/restock", json=payload, headers=admin_headers)
    assert resp_admin.status_code == 200
    assert resp_admin.json()["quantity"] == 6


def test_api_purchase_vehicle(
    client: TestClient,
    db: Session,
    user_headers: dict[str, str],
) -> None:
    """POST /api/vehicles/{id}/purchase is public to authenticated users and decreases stock."""
    vehicle = Vehicle(make="Kia", model="Telluride", category="SUV", price=Decimal("35000.00"), quantity=2)
    db.add(vehicle)
    db.commit()

    # Purchase 1 unit succeeds (200)
    resp = client.post(f"/api/vehicles/{vehicle.id}/purchase?quantity=1", headers=user_headers)
    assert resp.status_code == 200
    assert resp.json()["quantity"] == 1

    # Purchase another 2 units fails (400 Bad Request - only 1 unit left)
    resp_insufficient = client.post(f"/api/vehicles/{vehicle.id}/purchase?quantity=2", headers=user_headers)
    assert resp_insufficient.status_code == 400
    assert "Insufficient stock" in resp_insufficient.json()["detail"]


def test_api_search_vehicles(
    client: TestClient,
    db: Session,
    user_headers: dict[str, str],
) -> None:
    """GET /api/vehicles/search filters search queries correctly."""
    v1 = Vehicle(make="Toyota", model="Camry", category="Sedan", price=Decimal("25000.00"), quantity=2)
    v2 = Vehicle(make="Ford", model="F-150", category="Truck", price=Decimal("40000.00"), quantity=3)
    db.add(v1)
    db.add(v2)
    db.commit()

    # Search by category
    resp = client.get("/api/vehicles/search?category=Truck", headers=user_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["model"] == "F-150"

    # Search with no results
    resp_empty = client.get("/api/vehicles/search?make=Honda", headers=user_headers)
    assert resp_empty.status_code == 200
    assert len(resp_empty.json()) == 0
