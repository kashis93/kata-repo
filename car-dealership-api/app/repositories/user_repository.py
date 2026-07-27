"""Data-access functions for User entities."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


def get_by_id(db: Session, user_id: int) -> User | None:
    """
    Fetch a user by primary key.

    Args:
        db: Active SQLAlchemy session.
        user_id: User identifier.

    Returns:
        User | None: Matching user or None.
    """
    return db.get(User, user_id)


def get_by_email(db: Session, email: str) -> User | None:
    """
    Fetch a user by email address.

    Args:
        db: Active SQLAlchemy session.
        email: Unique user email.

    Returns:
        User | None: Matching user or None.
    """
    statement = select(User).where(User.email == email)
    return db.scalar(statement)


def create(
    db: Session,
    email: str,
    hashed_password: str,
    is_admin: bool = False,
) -> User:
    """
    Persist a new user record.

    Args:
        db: Active SQLAlchemy session.
        email: Unique email address.
        hashed_password: Bcrypt hash (never plain text).
        is_admin: Whether the user has administrative privileges.

    Returns:
        User: Newly created user instance.
    """
    user: User = User(
        email=email,
        hashed_password=hashed_password,
        is_admin=is_admin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
