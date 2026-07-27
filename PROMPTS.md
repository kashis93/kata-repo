# 🤖 AI Tooling & Prompt History — AutoLot Gallery

This document logs the primary AI prompts and assistant interactions used throughout the design, development, optimization, and deployment of **AutoLot Gallery**.

---

## 🎨 Prompt 1: High-End UI Design & Component Architecture

**User Prompt:**
> "I want to build a luxury supercar dealership web app called AutoLot Gallery using React 19, Vite, and Tailwind CSS v4. Design a dark mode, ultra-premium UI with champagne gold accents, glossy hero banner with full viewport coverage, responsive grid cards for supercars (Porsche 911 GT3 RS, Ferrari SF90, etc.), filter controls by make/price/body type, and modal dialogs for specifications."

**AI Assistance:**
- Generated `App.jsx`, `index.css` design system with custom CSS variables and utility classes.
- Created reusable components: `Navbar`, `HeroBanner`, `VehicleCard`, `FilterBar`, and `VehicleDetailModal`.

---

## 🎮 Prompt 2: Interactive 3D Showroom & Multi-Angle Stage Integration

**User Prompt:**
> "Add an interactive 3D virtual stage to the vehicle detail view. Include an embedded interactive 3D CAD mesh viewer (using Sketchfab 3D engine) allowing 360° rotation and zoom, plus a real photography studio turntable switcher for 4 distinct angles (3/4 Front, Side Profile, Rear 3/4, Frontal Facing)."

**AI Assistance:**
- Implemented `ThreeDShowroomModal.jsx` supporting seamless tab switching between interactive 3D CAD canvas rendering and studio photo turntable previews.

---

## ⚡ Prompt 3: Side-by-Side Supercar Comparison & Monroney Sticker

**User Prompt:**
> "Build a persistent vehicle comparison dock at the bottom of the screen where users can select up to 3 cars to compare specs (0-60 mph, top speed, MSRP, horsepower, engine type) side by side. Also implement a window sticker generator for official factory Monroney specs with CSV export capability."

**AI Assistance:**
- Built `ComparisonBar.jsx`, `ComparisonModal.jsx`, and `monroneyStickerUtil.js` with print-ready layout formatting and CSV file export logic.

---

## 🔒 Prompt 4: FastAPI Backend & JWT Authentication Architecture

**User Prompt:**
> "Create a Python FastAPI backend under `car-dealership-api/` with SQLAlchemy ORM, SQLite database, bcrypt password hashing, and JWT bearer authentication. Include endpoints for user registration, user login, vehicle inventory CRUD, and customer reservation logs."

**AI Assistance:**
- Architected the FastAPI backend under `car-dealership-api/app/`, including `auth` routers, security handlers, vehicle schemas, and database migrations.

---

## 🌐 Prompt 5: Vercel Single-Page Application (SPA) Deployment Setup

**User Prompt:**
> "Configure Vercel deployment for the monorepo so that the React Vite application inside `frontend/` builds and deploys cleanly to Vercel without serving the static root template."

**AI Assistance:**
- Created `vercel.json` configuration defining build command (`cd frontend && npm install && npm run build`), output directory (`frontend/dist`), and Vite SPA rewrite routing.
