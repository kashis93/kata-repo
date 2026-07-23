"""
Unit tests for authentication business logic service functions.
"""

import pytest
from sqlalchemy.orm import Session

from app.schemas.auth import LoginRequest, RegisterRequest
from app.services.auth_service import register_user, authenticate_user, get_user_by_id
from app.models.user import User


def test_register_user_success(db: Session) -> None:
    """Registering a new user should succeed and save in database."""
    req = RegisterRequest(email="newuser@test.com", password="securepassword123")
    user = register_user(db, req)

    assert user.id is not None
    assert user.email == "newuser@test.com"
    assert user.is_admin is False

    # Check database persistence
    db_user = db.query(User).filter(User.id == user.id).first()
    assert db_user is not None
    assert db_user.email == "newuser@test.com"


def test_register_user_duplicate_email_fails(db: Session) -> None:
    """Registering with an email that already exists should raise ValueError."""
    req = RegisterRequest(email="duplicate@test.com", password="password123")
    register_user(db, req)

    with pytest.raises(ValueError) as excinfo:
        register_user(db, req)
    assert "already exists" in str(excinfo.value)


def test_authenticate_user_success(db: Session) -> None:
    """Authenticating with correct credentials should return access token."""
    # Register first
    reg_req = RegisterRequest(email="loginuser@test.com", password="correctpassword123")
    register_user(db, reg_req)

    # Login
    login_req = LoginRequest(email="loginuser@test.com", password="correctpassword123")
    token_resp = authenticate_user(db, login_req)

    assert token_resp.access_token is not None
    assert token_resp.token_type == "bearer"


def test_authenticate_user_invalid_email_fails(db: Session) -> None:
    """Authenticating with non-existent email should raise ValueError."""
    login_req = LoginRequest(email="nonexistent@test.com", password="password123")
    with pytest.raises(ValueError) as excinfo:
        authenticate_user(db, login_req)
    assert "Invalid email or password" in str(excinfo.value)


def test_authenticate_user_wrong_password_fails(db: Session) -> None:
    """Authenticating with wrong password should raise ValueError."""
    reg_req = RegisterRequest(email="loginuser@test.com", password="correctpassword123")
    register_user(db, reg_req)

    login_req = LoginRequest(email="loginuser@test.com", password="wrongpassword")
    with pytest.raises(ValueError) as excinfo:
        authenticate_user(db, login_req)
    assert "Invalid email or password" in str(excinfo.value)


def test_get_user_by_id(db: Session) -> None:
    """Retrieving user by ID should return correct user or None."""
    reg_req = RegisterRequest(email="getuser@test.com", password="password123")
    user = register_user(db, reg_req)

    found = get_user_by_id(db, user.id)
    assert found is not None
    assert found.email == "getuser@test.com"

    not_found = get_user_by_id(db, 9999)
    assert not_found is None
