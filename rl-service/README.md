# Dual-Agent Reinforcement Learning Microservice

Python FastAPI microservice implementing the **Dual-Agent Reinforcement Learning Policy and Gymnasium Virtual Smart Home Environment**.

## 🚀 Quick Start

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the FastAPI RL service:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

3. Endpoint Documentation:
   - Health check: `GET http://localhost:8000/`
   - Prediction API: `POST http://localhost:8000/predict`
   - Interactive Swagger API Docs: `http://localhost:8000/docs`
