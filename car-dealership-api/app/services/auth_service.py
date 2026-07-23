"""Authentication business logic for user registration and login."""

from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse


def register_user(db: Session, data: RegisterRequest) -> User:
    """
    Register a new user with email and password.

    Args:
        db: Database session.
        data: Registration payload with email and password.

    Returns:
        User: The newly created user instance.

    Raises:
        ValueError: If a user with the email already exists.
    """
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise ValueError("User with this email already exists")

    hashed_pw = hash_password(data.password)
    new_user = User(
        email=data.email,
        hashed_password=hashed_pw,
        is_admin=False,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def authenticate_user(db: Session, data: LoginRequest) -> TokenResponse:
    """
    Authenticate a user and return an access token.

    Args:
        db: Database session.
        data: Login payload with email and password.

    Returns:
        TokenResponse: OAuth2-style token response with access_token.

    Raises:
        ValueError: If credentials are invalid or user doesn't exist.
    """
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise ValueError("Invalid email or password")

    if not verify_password(data.password, user.hashed_password):
        raise ValueError("Invalid email or password")

    access_token = create_access_token(subject=str(user.id))
    return TokenResponse(access_token=access_token)


def get_user_by_id(db: Session, user_id: int) -> User | None:
    """
    Retrieve a user by their ID.

    Args:
        db: Database session.
        user_id: The user's primary key.

    Returns:
        User | None: The user if found, otherwise None.
    """
    return db.query(User).filter(User.id == user_id).first()
