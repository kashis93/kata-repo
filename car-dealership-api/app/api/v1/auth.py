"""Authentication API endpoints for registration and login."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserResponse
from app.services.auth_service import authenticate_user, get_user_by_id, register_user

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user account.

    - **email**: User's email address (must be unique)
    - **password**: Password (min 8 characters, no leading/trailing spaces)
    """
    try:
        user = register_user(db, data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate with email and password to receive an access token.

    - **email**: User's email address
    - **password**: User's password

    Returns a bearer token that can be used in the Authorization header.
    """
    try:
        token_response = authenticate_user(db, data)
        return token_response
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """
    Get the currently authenticated user's information.

    Requires a valid Bearer token in the Authorization header.
    """
    return current_user
