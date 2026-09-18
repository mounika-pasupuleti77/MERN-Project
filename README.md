# AI-Based Smart Home Energy Management using Dual-Agent Reinforcement Learning with Virtual IoT Dashboard

> **B.Tech Major Project** — Comprehensive MERN Stack & Python Gymnasium Reinforcement Learning Application.

---

## 📌 Project Overview

This project implements an intelligent, software-only **Smart Home Energy Management System (SHEMS)** driven by **Dual-Agent Reinforcement Learning**. The system optimizes energy consumption, maximizes solar photovoltaic utilization, manages battery storage state-of-charge (SOC), and reduces peak grid demand and electricity bills through automated appliance load shifting.

- **No Hardware Dependencies**: Software-only simulation using realistic Virtual IoT telemetry.
- **Decoupled Architecture**: Independent React Dashboard, Node.js REST API Backend, and Python Gymnasium RL Service.

---

## 🏗️ Application Architecture

```text
                     React Frontend (Port 5173)
                                 |
                                 | REST APIs (Axios)
                                 ↓
                   Node.js + Express Backend (Port 5000)
                                 |
                 ┌───────────────┴───────────────┐
                 ↓                               ↓
         MongoDB Database              Python RL Service (Port 8000)
                                                 |
                                                 ↓
                                       Gymnasium Environment
                                                 |
                                  ┌──────────────┴──────────────┐
                                  ↓                             ↓
                           Agent 1                       Agent 2
                        Energy Supply                 Appliance Scheduling
```

---

## 🛠️ Technology Stack

### Frontend
- **React.js & Vite**: Fast SPA UI development
- **Recharts**: Time-series charts & cost analytics
- **Lucide React**: Modern iconography
- **Axios**: API communication with JWT interceptors
- **CSS3**: Glassmorphism dark mode UI

### Backend
- **Node.js & Express.js**: REST API server
- **MongoDB & Mongoose**: Object Data Modeling (ODM)
- **JWT & bcryptjs**: Secure token authentication & password hashing
- **dotenv & CORS**: Environment configuration & cross-origin authorization

### AI / Reinforcement Learning
- **Python 3.10+ & FastAPI**: High-performance microservice
- **Gymnasium**: Custom virtual smart home environment (`SmartHomeEnv`)
- **Stable-Baselines3**: Dual-agent PPO reinforcement learning policies

---

## 📂 Project Structure

```text
smart-home-backend/
├── frontend/                        # React + Vite Frontend Dashboard
│   ├── src/
│   │   ├── components/              # Sidebar, Navbar, EnergyFlow, StatCard
│   │   ├── context/                 # AuthContext (JWT & user state)
│   │   ├── layouts/                 # MainLayout shell
│   │   ├── pages/                   # Dashboard, Appliances, Solar, Battery, Schedule, RlDecisions, Analytics, Settings, Login, Register
│   │   ├── services/                # api.js (Axios API client)
│   │   └── styles/                  # index.css (Glassmorphism dark theme)
│   └── package.json
│
├── backend/                         # Node.js Express REST API Backend
│   ├── config/                      # db.js (Mongoose MongoDB + Memory Fallback)
│   ├── controllers/                 # auth, appliance, energy, solar, battery, schedule, rl, analytics, dashboard
│   ├── models/                      # User, Appliance, EnergyData, SolarData, Battery, EnergyPrice, Schedule
│   ├── routes/                      # API endpoints router
│   ├── middleware/                  # authMiddleware, errorMiddleware
│   ├── utils/                       # energyCalculator, virtualIotSimulator
│   └── server.js
│
└── rl-service/                      # Python Gymnasium RL Microservice
    ├── main.py                      # FastAPI server (POST /predict)
    ├── environment.py               # Custom Gymnasium environment
    ├── agents.py                    # Dual-Agent policy prediction manager
    └── requirements.txt
```

---

## 🚀 How to Run the Application

### 1. Backend Service (Port 5000)

```bash
cd backend
npm install
npm run dev
```

> **Note on MongoDB**: If a local MongoDB instance (`mongodb://127.0.0.1:27017`) is not running, the backend automatically launches an embedded **In-Memory MongoDB Server** for zero-setup execution!

### 2. Frontend Dashboard (Port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.

### 3. Python RL Microservice (Port 8000)

```bash
cd rl-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## ⚙️ Environment Variables (`.env`)

### Backend `.env` (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smarthome_energy
JWT_SECRET=smarthome_jwt_secret_key_2026_super_secure
RL_SERVICE_URL=http://localhost:8000/predict
```

### Frontend `.env` (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints Summary

| Feature | Method | Endpoint | Description |
|---|---|---|---|
| Health | `GET` | `/api/health` | Service status check |
| Auth | `POST` | `/api/auth/register` | Register user account |
| Auth | `POST` | `/api/auth/login` | Authenticate & get JWT |
| Auth | `GET` | `/api/auth/me` | Get profile (Protected) |
| Dashboard | `GET` | `/api/dashboard` | Consolidated metrics payload |
| Appliances | `GET` | `/api/appliances` | Get smart appliances list |
| Appliances | `POST` | `/api/appliances` | Create new appliance |
| Appliances | `PATCH` | `/api/appliances/:id/status` | Toggle appliance ON/OFF |
| Energy | `GET` | `/api/energy/current` | Real-time demand & grid metrics |
| Solar | `GET` | `/api/solar/current?weather=Sunny` | Weather-driven solar output |
| Battery | `GET` | `/api/battery` | Battery SOC & parameters |
| Battery | `POST` | `/api/battery/charge` | Charge (+1 kWh) with SOC checks |
| Battery | `POST` | `/api/battery/discharge` | Discharge (-1 kWh) with SOC checks |
| Scheduling | `GET` | `/api/schedules` | Appliance schedules |
| Analytics | `GET` | `/api/analytics/summary` | Chart statistics & cost savings |
| RL Agent | `POST` | `/api/rl/decision` | Evaluate Dual-Agent policy |

---

## 🏆 Project Review & Demonstration Checklist

During your project review, demonstrate these key flows:

1. **Dashboard Overview**: Show real-time cards and the **Visual Energy Flow Diagram** (`Solar → Home ← Battery → Grid`).
2. **Appliance Control**: Toggle appliances (EV Charger, Washing Machine) ON/OFF; observe real-time load updates.
3. **Solar Weather Simulation**: Switch between *Sunny*, *Cloudy*, and *Variable* weather states; observe the live solar output curve.
4. **Battery Safety Bounds**: Click *Discharge* until SOC approaches 15%; verify that the system blocks over-discharge below the minimum SOC limit.
5. **Dual-Agent RL Page**: Input high peak tariff ($0.34/kWh) and hour (18:00); observe **Agent 1** recommend *Battery Discharge* and **Agent 2** recommend *Shift Washing Machine to 1:00 AM*.
6. **Analytics & Financial Impact**: Show the 6 Recharts graphs and **40% Cost Savings Card** ($6.50/day vs $3.90/day).
