from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from agents import DualAgentManager

app = FastAPI(
    title="Dual-Agent Reinforcement Learning Service",
    description="Python FastAPI Gymnasium RL Microservice for Smart Home Energy Management",
    version="1.0.0"
)

agent_manager = DualAgentManager()

class RLStateRequest(BaseModel):
    solarGeneration: float = 0.0
    loadDemand: float = 0.0
    batterySOC: float = 50.0
    electricityPrice: float = 0.15
    time: int = 12
    appliances: Optional[List] = []

@app.get("/")
def read_root():
    return {
        "status": "OK",
        "service": "Python Gymnasium Dual-Agent RL Service",
        "timestamp": datetime.now()
    }

@app.post("/predict")
@app.post("/api/rl/predict")
def predict_decision(state: RLStateRequest):
    decision = agent_manager.predict(
        solar_gen=state.solarGeneration,
        load_demand=state.loadDemand,
        battery_soc=state.batterySOC,
        price=state.electricityPrice,
        hour=state.time
    )

    return {
        "timestamp": datetime.now(),
        **decision,
        "source": "Python Gymnasium RL Service (FastAPI)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
