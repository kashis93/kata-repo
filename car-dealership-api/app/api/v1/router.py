"""API router combining all v1 endpoints."""

from fastapi import APIRouter

from app.api.v1 import auth, vehicles

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
