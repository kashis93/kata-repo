from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import time

app = FastAPI(title="AutoLot Gallery FastAPI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for Vercel Serverless instance
VEHICLES_DB = [
    {"id": "v1", "make": "Porsche", "model": "911 GT3 RS", "category": "Coupe", "price": 241300, "quantity": 2},
    {"id": "v2", "make": "Ferrari", "model": "SF90 Stradale", "category": "Coupe", "price": 524000, "quantity": 1},
    {"id": "v3", "make": "Aston Martin", "model": "DBS 770 Ultimate", "category": "Coupe", "price": 387600, "quantity": 3},
    {"id": "v4", "make": "Mercedes-Benz", "model": "AMG GT Black Series", "category": "Coupe", "price": 325000, "quantity": 1},
    {"id": "v5", "make": "Lamborghini", "model": "Huracán Sterrato", "category": "Coupe", "price": 278900, "quantity": 2},
    {"id": "v6", "make": "McLaren", "model": "750S Spider", "category": "Convertible", "price": 345000, "quantity": 2},
    {"id": "v7", "make": "Audi", "model": "RS e-tron GT", "category": "Electric", "price": 147100, "quantity": 4},
    {"id": "v8", "make": "BMW", "model": "M8 Competition Coupe", "category": "Coupe", "price": 138800, "quantity": 3},
    {"id": "v9", "make": "Bugatti", "model": "Chiron Pur Sport", "category": "Coupe", "price": 3600000, "quantity": 1},
    {"id": "v10", "make": "Chevrolet", "model": "Corvette Z06 C8.R", "category": "Coupe", "price": 128900, "quantity": 2}
]

class VehicleCreate(BaseModel):
    make: str
    model: str
    category: Optional[str] = "Sedan"
    price: float
    quantity: int = 1

class UserLogin(BaseModel):
    email: str
    password: str

@app.get("/api/health")
def health():
    return {"status": "online", "service": "AutoLot FastAPI Engine"}

@app.get("/api/vehicles")
def get_vehicles():
    return VEHICLES_DB

@app.post("/api/vehicles")
def add_vehicle(vehicle: VehicleCreate):
    new_id = f"v_{int(time.time())}"
    new_vehicle = {
        "id": new_id,
        "make": vehicle.make,
        "model": vehicle.model,
        "category": vehicle.category,
        "price": vehicle.price,
        "quantity": vehicle.quantity
    }
    VEHICLES_DB.append(new_vehicle)
    return new_vehicle

@app.post("/api/auth/login")
def login(credentials: UserLogin):
    is_admin = "admin" in credentials.email.lower()
    return {
        "access_token": f"token_{credentials.email}_{int(time.time())}",
        "token_type": "bearer",
        "user": {
            "email": credentials.email,
            "is_admin": is_admin
        }
    }

@app.get("/api/auth/me")
def get_me():
    return {
        "id": "usr_demo",
        "email": "admin@autolot.com",
        "is_admin": True,
        "name": "AutoLot Admin"
    }
