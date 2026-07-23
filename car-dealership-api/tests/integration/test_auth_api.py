"""
Integration tests for the Authentication API endpoints.
"""

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User


def test_api_register_success(client: TestClient, db: Session) -> None:
    """POST /api/auth/register should successfully create a user account."""
    payload = {"email": "newapiuser@test.com", "password": "password123"}
    resp = client.post("/api/auth/register", json=payload)

    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "newapiuser@test.com"
    assert "id" in data
    assert "is_admin" in data
    assert data["is_admin"] is False

    # Check database
    db_user = db.query(User).filter(User.email == "newapiuser@test.com").first()
    assert db_user is not None


def test_api_register_validation_fails(client: TestClient) -> None:
    """POST /api/auth/register with bad input should return 422 Unprocessable Entity."""
    # Password too short
    payload = {"email": "newapiuser@test.com", "password": "abc"}
    resp = client.post("/api/auth/register", json=payload)
    assert resp.status_code == 422

    # Invalid email structure
    payload2 = {"email": "bademail.com", "password": "password123"}
    resp2 = client.post("/api/auth/register", json=payload2)
    assert resp2.status_code == 422


def test_api_register_duplicate_email_fails(client: TestClient, test_user: User) -> None:
    """POST /api/auth/register with existing email should return 400 Bad Request."""
    payload = {"email": test_user.email, "password": "password123"}
    resp = client.post("/api/auth/register", json=payload)

    assert resp.status_code == 400
    assert "already exists" in resp.json()["detail"]


def test_api_login_success(client: TestClient, test_user: User) -> None:
    """POST /api/auth/login with valid credentials returns a bearer token."""
    payload = {"email": test_user.email, "password": "userpassword123"}
    resp = client.post("/api/auth/login", json=payload)

    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_api_login_wrong_credentials_fails(client: TestClient, test_user: User) -> None:
    """POST /api/auth/login with invalid password returns 401 Unauthorized."""
    payload = {"email": test_user.email, "password": "wrongpassword"}
    resp = client.post("/api/auth/login", json=payload)

    assert resp.status_code == 401
    assert "Invalid email or password" in resp.json()["detail"]


def test_api_get_me_success(client: TestClient, user_headers: dict[str, str], test_user: User) -> None:
    """GET /api/auth/me with valid Bearer token returns current user info."""
    resp = client.get("/api/auth/me", headers=user_headers)

    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == test_user.email
    assert data["id"] == test_user.id


def test_api_get_me_no_auth_fails(client: TestClient) -> None:
    """GET /api/auth/me without token returns 401 Unauthorized."""
    resp = client.get("/api/auth/me")
    assert resp.status_code == 401
