# 🏎️ AutoLot Gallery — Premier Automotive Dealership Platform

An end-to-end, production-ready automotive gallery and dealership web application built with **React 19, Vite, Tailwind CSS v4, Three.js 3D Showroom, and FastAPI Python Backend**.

![AutoLot Gallery](https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Features

- 🚗 **Curated Luxury Inventory**: Display 12+ high-performance vehicles (Porsche, Ferrari, Lamborghini, Aston Martin, Mercedes-AMG, McLaren, Audi RS, BMW M, Tesla, Chevrolet, Ford, Toyota).
- 🖼️ **Full-Bleed Edge-to-Edge Hero Banner**: Featuring cinematic photography and color-matched typography.
- 🔒 **Authentication System**: User registration, login, JWT token management, and role-based access control (Admin / Customer).
- 🎮 **Interactive 3D Showroom**: 360° virtual turntable viewing powered by **Three.js** and Sketchfab 3D CAD mesh integration.
- ⚡ **Side-by-Side Model Comparison**: Select multiple vehicles and compare technical specifications head-to-head.
- 📄 **Monroney Window Sticker System**: View and print official factory specification stickers with CSV export.
- 🛠️ **Admin Management Console**: Add, edit, delete fleet vehicles, manage allocations, and view real-time customer purchase orders.
- 📱 **Fully Responsive Design**: Optimized for mobile, tablet, and desktop screens with glassmorphism UI tokens.

---

## 📁 Repository Structure

```
incobyte/
├── frontend/                       # React 19 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/            # UI Components (VehicleCard, Navbar, HeroBanner, Modals, AdminPanel)
│   │   ├── context/               # AuthContext for JWT authentication & user sessions
│   │   ├── data/                  # Curated vehicle fleet presets
│   │   ├── pages/                 # Full pages (LoginPage, RegisterPage, Services, Financing, About, Contact)
│   │   ├── services/              # API services (backend integration, carImageService, imageCache)
│   │   ├── utils/                 # CSV export & sticker utilities
│   │   ├── App.jsx                # Main Application Entry
│   │   └── index.css              # Global Design Tokens & Tailwind Directives
│   └── package.json
│
├── car-dealership-api/             # FastAPI Python Backend
│   ├── app/
│   │   ├── api/v1/                # REST endpoints (/auth, /vehicles)
│   │   ├── core/                  # Security & configuration settings
│   │   ├── db/                    # SQLAlchemy models & sessions
│   │   └── services/              # Business logic & authentication service
│   ├── Dockerfile                 # Container deployment configuration
│   └── requirements.txt           # Python dependencies
│
├── index.html                      # Standalone static landing preview
├── login.html                      # Standalone static login page
├── signup.html                     # Standalone static signup page
├── styles.css                      # Standalone CSS design system
└── README.md                       # Master Documentation
```

---

## 🚀 Quick Start Guide

### 1. Run the Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. Run the Backend API (FastAPI)
```bash
cd car-dealership-api
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/svg/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at **`http://localhost:8000/docs`**.

---

## 🔐 Credentials & Quick Demo Accounts

- **Admin Account**: `admin@autolot.com` / `adminpassword` (Access to Admin Console)
- **Customer Account**: `client@autolot.com` / `clientpassword`

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Three.js, Recharts, Canvas-Confetti, Motion
- **Backend**: FastAPI, SQLAlchemy, Alembic, SQLite / PostgreSQL, Pydantic, Passlib (Bcrypt), Python-JOSE
- **DevOps**: Docker, Uvicorn, Vercel / Netlify ready

---

## 📝 License

Distributed under the Apache-2.0 License.
