"""
Pytest configuration and fixtures.

Sets up an in-memory SQLite database for test isolation and provides
FastAPI test clients and authentication helpers.
"""

from collections.abc import Generator
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.core.security import hash_password, create_access_token
from app.models.user import User

# In-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=Session)


@pytest.fixture(name="db", scope="function")
def db_fixture() -> Generator[Session, None, None]:
    """
    Create an isolated database session for a test.
    Tables are created before the test and dropped after.
    """
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(name="client")
def client_fixture(db: Session) -> Generator[TestClient, None, None]:
    """
    Configure TestClient with dependency override for database session.
    """
    def override_get_db() -> Generator[Session, None, None]:
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(name="test_user")
def test_user_fixture(db: Session) -> User:
    """Create a standard customer user in the test database."""
    user = User(
        email="user@test.com",
        hashed_password=hash_password("userpassword123"),
        is_admin=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(name="test_admin")
def test_admin_fixture(db: Session) -> User:
    """Create an admin user in the test database."""
    user = User(
        email="admin@test.com",
        hashed_password=hash_password("adminpassword123"),
        is_admin=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(name="user_headers")
def user_headers_fixture(test_user: User) -> dict[str, str]:
    """Return authorization headers for standard user."""
    token = create_access_token(subject=str(test_user.id))
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(name="admin_headers")
def admin_headers_fixture(test_admin: User) -> dict[str, str]:
    """Return authorization headers for admin user."""
    token = create_access_token(subject=str(test_admin.id))
    return {"Authorization": f"Bearer {token}"}
