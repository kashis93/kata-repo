<div align="center">

  # 🏎️ AutoLot Gallery
  ### *Premier Automotive Dealership & Virtual 3D Showroom Platform*

  [![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://kata-repo-n87chtv8z-kashis93s-projects.vercel.app/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
  [![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
  [![Three.js](https://img.shields.io/badge/Three.js-3D_Engine-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

  <br />

  <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=85" alt="AutoLot Gallery Hero Preview" width="100%" style="border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);" />

  <br />
  <br />

  [🌐 Live Vercel App](https://kata-repo-n87chtv8z-kashis93s-projects.vercel.app/) • [⚡ Production URL](https://kata-repo.vercel.app/) • [View API Docs](http://localhost:8000/docs) • [Report Issue](https://github.com/kashis93/kata-repo/issues)

</div>

---

## 🌐 Live Deployment

> [!IMPORTANT]
> **Production Vercel URL**: [https://kata-repo-n87chtv8z-kashis93s-projects.vercel.app/](https://kata-repo-n87chtv8z-kashis93s-projects.vercel.app/)  
> **Custom Domain**: [https://kata-repo.vercel.app/](https://kata-repo.vercel.app/)

The application is deployed live on **Vercel** with continuous deployment integrated directly from the `main` branch.

---

## 🤖 My AI Usage

### 🛠️ AI Tools Used
- **Google Gemini / Antigravity AI Assistant**: Used as an agentic pair programmer throughout the full-stack software development lifecycle.

### 💡 How AI Was Used
1. **Frontend Architecture & Design System**: Used AI prompts to generate dark-mode luxury design tokens, Tailwind v4 utility styles, responsive vehicle inventory grid cards, and interactive modal dialogs.
2. **3D Interactive Showroom & Stage**: Prompted AI to build `ThreeDShowroomModal.jsx` integrating Sketchfab 3D CAD mesh embeds and multi-angle studio photo turntable controls.
3. **FastAPI Backend & Security**: Used AI assistant to scaffold SQLAlchemy ORM models, bcrypt password hashing, and JWT token authentication routines.
4. **Monorepo Deployment**: Worked with AI to configure `vercel.json` rewrite rules and resolve monorepo SPA routing for seamless Vercel deployment.

### 🧠 Workflow Reflection & Impact
Leveraging AI as a collaborative pair programmer dramatically accelerated development velocity. It enabled rapid prototyping of modern React 19 UI components, automated complex boilerplate setup for FastAPI and SQLAlchemy, and provided immediate troubleshooting for Vercel deployment configurations.

---

## 📖 Overview

**AutoLot Gallery** is a full-stack, enterprise-grade automotive dealership platform designed for luxury vehicle reservation, virtual showroom inspection, and dealership fleet management. 

Featuring a **full-bleed edge-to-edge supercar hero banner**, **interactive 3D CAD showroom viewing**, **head-to-head model comparison**, **JWT authentication**, and **real-time backend inventory synchronization**, AutoLot Gallery delivers a state-of-the-art digital buying experience.

> [!TIP]
> **Live Demo Access**: The application features instant **⚡ Demo Admin** and **⚡ Demo Client** sign-in modes for immediate testing without manual database configuration.

---

## ✨ Key Features

### 🏎️ 1. Curated Luxury Fleet
- Browse 12+ high-performance supercars & luxury vehicles (Porsche 911 GT3 RS, Ferrari SF90 Stradale, Aston Martin DBS 770, Mercedes-AMG GT, Lamborghini Huracán, McLaren 750S, Audi RS e-tron GT, BMW M8, Tesla, Ford, Chevrolet, Toyota).
- Filter by **Make**, **Body Type** (Coupe, SUV, Convertible, Electric, Wagon, Sedan), **Price Range**, and keyword search.

### 🖼️ 2. Edge-to-Edge Hero Presentation
- Full-bleed 100% viewport width hero section featuring glossy **Rosso Corsa Red Ferrari SF90 Stradale** photography.
- High-contrast champagne gold typography and color-matched call-to-action controls.

### 🔒 3. User & Admin Authentication
- Built-in **Sign Up** and **Sign In** workflow using **FastAPI JWT Bearer tokens** and local storage persistence.
- Role-based authorization distinguishing **Admin Console** operators from **VIP Clients**.

### 🎮 4. Virtual 3D Showroom Stage
- **3D CAD Mesh View (Sketchfab Engine)**: Interactive 3D car models supporting 360° drag rotation, pinch-zoom, and panning.
- **Real Photo 360° Turntable**: Multi-angle studio photography switcher (3/4 Front, Side Profile, Rear 3/4, Direct Facing).

### ⚡ 5. Side-by-Side Model Comparison
- Dock up to 3 vehicles into a persistent bottom bar for head-to-head performance metric analysis.

### 📄 6. Monroney Window Sticker Management
- View and print official factory Monroney stickers detailing MSRP pricing, horsepower, transmission specs, VIN numbers, and standard equipment.
- One-click **CSV Inventory Export**.

### 🛠️ 7. Admin Control Panel
- Complete fleet CRUD operations: Add new vehicles, modify stock quantities, update pricing, or delete sold units.
- Real-time customer reservation orders log with timestamp tracking.

---

## 📁 Repository Structure

```
kata-repo/
├── 📁 frontend/                        # Production React 19 SPA (Vite + Tailwind CSS v4)
│   ├── 📁 src/
│   │   ├── 📁 components/             # UI Components (HeroBanner, Navbar, VehicleCard, Modals, AdminPanel)
│   │   ├── 📁 context/                # AuthContext (JWT Tokens, Session Persistence, User Roles)
│   │   ├── 📁 data/                   # Curated Luxury Vehicle Presets
│   │   ├── 📁 pages/                  # Full Pages (LoginPage, RegisterPage, Services, Financing, About, Contact)
│   │   ├── 📁 services/               # API Services (Backend client, carImageService, imageCache)
│   │   ├── 📁 utils/                  # CSV Export & Monroney sticker utilities
│   │   ├── 📄 App.jsx                 # Application Root Component
│   │   └── 📄 index.css               # AutoLot Design Tokens & Tailwind Directives
│   └── 📄 package.json
│
├── 📁 car-dealership-api/              # FastAPI Python Backend Service
│   ├── 📁 app/
│   │   ├── 📁 api/v1/                 # REST endpoints (/auth/register, /auth/login, /vehicles)
│   │   ├── 📁 core/                   # Security, Password Hashing (Bcrypt), JWT Tokens
│   │   ├── 📁 db/                     # SQLAlchemy ORM Models & DB Sessions
│   │   └── 📁 services/               # Auth & Vehicle Service Layer
│   ├── 📄 Dockerfile                  # Container Deployment Config
│   └── 📄 requirements.txt
│
├── 📄 vercel.json                      # Vercel Deployment & Rewrites Configuration
├── 📄 PROMPTS.md                       # AI Tooling & Prompt History Log
├── 📄 .gitignore                       # Clean Git Ignore Exclusions
└── 📄 README.md                        # Project Master Documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js (v18+)](https://nodejs.org/)
- [Python (v3.10+)](https://www.python.org/)

---

### 1. Launch the Frontend Web App

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server
npm run dev
```

> The React frontend will run at **`http://localhost:3000`**.

---

### 2. Launch the FastAPI Backend API

```bash
# Navigate to backend directory
cd car-dealership-api

# Create & activate Python virtual environment
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Linux / macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start Uvicorn API Server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

> FastAPI Interactive Documentation will be live at **`http://localhost:8000/docs`**.

---

## 🔑 Quick Demo Credentials

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@autolot.com` | `adminpassword` | Full Inventory CRUD, Order Logs, Admin Console |
| **VIP Client** | `client@autolot.com` | `clientpassword` | Vehicle Reservations, Favorites, Comparisons |

---

## 🔌 Core API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate and receive JWT Bearer token | ❌ |
| `GET` | `/api/auth/me` | Fetch active user profile details | 🔒 |
| `GET` | `/api/vehicles` | Fetch all inventory vehicles | ❌ |
| `POST` | `/api/vehicles` | Add a new vehicle to inventory | 🔒 Admin |
| `PUT` | `/api/vehicles/{id}` | Update existing vehicle specs | 🔒 Admin |
| `DELETE` | `/api/vehicles/{id}` | Delete a vehicle from inventory | 🔒 Admin |
| `POST` | `/api/vehicles/{id}/purchase` | Record a customer reservation | ❌ |

---

## 💻 Tech Stack Summary

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Three.js, Recharts, Canvas-Confetti
- **Backend**: FastAPI, SQLAlchemy, Alembic, SQLite / PostgreSQL, Pydantic, Python-JOSE, Passlib
- **Deployment**: Vercel (Frontend SPA), Docker / Uvicorn (Backend)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/kashis93/kata-repo/issues).

---

## 📝 License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/kashis93">kashis93</a></sub>
</div>
