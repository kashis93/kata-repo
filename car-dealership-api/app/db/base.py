"""Declarative base for all ORM models."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Base class for SQLAlchemy ORM models.

    All entity models inherit from this class so their tables are
    registered on `Base.metadata` for migrations and `create_all`.
    """

    pass
