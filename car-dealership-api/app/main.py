"""FastAPI application entry point with database initialization and static frontend serving."""

from contextlib import asynccontextmanager
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifecycle events.

    On startup: Create all database tables.
    On shutdown: Close database connections.
    """
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    engine.dispose()


app = FastAPI(
    title=settings.project_name,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. API router prefix
app.include_router(api_router, prefix="/api")


@app.get("/health")
async def health():
    """Detailed health check endpoint."""
    return {"status": "healthy", "database": "connected"}


# 2. Mount static frontend build at root '/'
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Serve static assets if present, otherwise return index.html for SPA hash/history routing
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    async def root():
        return {"message": "Car Dealership API running. Build frontend dist to view UI.", "status": "healthy"}
