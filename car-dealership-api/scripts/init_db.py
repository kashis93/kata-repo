"""
One-time script to create all database tables from SQLAlchemy models.

Run this manually during development. In production, use Alembic
migrations instead of this script.
"""

from app.db.base import Base
from app.db.session import engine


def init_db() -> None:
    """Create all tables defined on Base.metadata if they don't already exist."""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")


if __name__ == "__main__":
    init_db()