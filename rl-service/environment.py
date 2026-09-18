import gymnasium as gym
from gymnasium import spaces
import numpy as np

class SmartHomeEnv(gym.Env):
    """
    Custom Gymnasium Environment representing the Virtual Smart Home Energy Management System.
    Observation space: [solarGeneration, loadDemand, batterySOC, electricityPrice, hourOfDay]
    """
    metadata = {"render_modes": ["human"]}

    def __init__(self):
        super(SmartHomeEnv, self).__init__()

        # Observation Space: [Solar(kW), Load(kW), SOC(%), Price($/kWh), Hour(0-23)]
        self.observation_space = spaces.Box(
            low=np.array([0.0, 0.0, 0.0, 0.0, 0.0], dtype=np.float32),
            high=np.array([10.0, 15.0, 100.0, 1.0, 23.0], dtype=np.float32),
            dtype=np.float32
        )

        # Action Space for Agent 1 (Supply): 
        # 0: Grid Import, 1: Direct Solar, 2: Charge Battery, 3: Discharge Battery
        self.action_space_agent1 = spaces.Discrete(4)

        # Action Space for Agent 2 (Demand/Scheduling):
        # 0: Maintain Schedule, 1: Shift Appliance to Off-Peak, 2: Shed Non-Essential Load
        self.action_space_agent2 = spaces.Discrete(3)

        self.state = None

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        # Default state: 4.0 kW solar, 3.5 kW load, 50% SOC, $0.15/kWh, 12:00 PM
        self.state = np.array([4.0, 3.5, 50.0, 0.15, 12.0], dtype=np.float32)
        return self.state, {}

    def step(self, action_agent1, action_agent2):
        solar, load, soc, price, hour = self.state

        # Calculate reward based on energy cost reduction, solar utilization, & SOC health
        grid_import = max(0, load - solar)
        if action_agent1 == 3 and soc > 15: # Discharge battery
            grid_import = max(0, grid_import - 1.5)
            soc = max(15, soc - 15)
        elif action_agent1 == 2 and solar > load and soc < 95: # Charge battery
            soc = min(95, soc + 15)

        if action_agent2 == 1: # Shift appliance
            load = max(0.5, load - 1.5) # Reduce peak load demand

        cost = grid_import * price
        reward = -cost + (solar * 0.1) # Penalty for grid cost + bonus for clean solar usage

        # Advance hour
        new_hour = (hour + 1) % 24
        self.state = np.array([solar, load, soc, price, new_hour], dtype=np.float32)

        terminated = False
        truncated = False

        return self.state, float(reward), terminated, truncated, {"gridImport": grid_import, "cost": cost}
