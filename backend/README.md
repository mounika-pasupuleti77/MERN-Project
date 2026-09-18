# AI-Based Smart Home Energy Management System - Backend

Backend REST API for **AI-Based Smart Home Energy Management using Dual-Agent Reinforcement Learning with Virtual IoT Dashboard**.

Built with **Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, and Dual-Agent RL Integration**.

## 🚀 Features

- **Authentication & User Management**: JWT token authentication with bcryptjs password hashing (`/api/auth`)
- **Smart Appliance Controller**: Manage appliances, power ratings, operating schedules, and ON/OFF status (`/api/appliances`)
- **Energy & Solar Telemetry**: Track consumption, grid import/export, dynamic tariffs, and weather-driven solar output (`/api/energy`, `/api/solar`)
- **Battery Management**: Monitor SOC, charge/discharge rates, and min/max SOC boundary protections (`/api/battery`)
- **Appliance Scheduler**: Optimize appliance schedules based on electricity prices and solar availability (`/api/schedules`)
- **Dual-Agent Reinforcement Learning Interface**: Endpoint `/api/rl/decision` routing to external Python Gymnasium RL environment (Agent 1: Energy Supply, Agent 2: Appliance Demand/Shift) with intelligent fallback
- **Analytics & Dashboard APIs**: Consolidated endpoints tailored for Recharts frontend visualization (`/api/analytics`, `/api/dashboard`)

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT & bcryptjs
- **Environment**: dotenv, cors

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (Local instance or MongoDB Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mounika-pasupuleti77/MERN-Project.git
   cd MERN-Project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/smarthome_energy
   JWT_SECRET=your_jwt_secret_key_here
   RL_SERVICE_URL=http://localhost:8000/api/rl/predict
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

The backend server will run on `http://localhost:5000`.

---

## 📡 Health Check

Verify that the server is up and running:
```
GET http://localhost:5000/api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Smart Home Energy Management Backend is running"
}
```

---

## 📜 License

ISC License
