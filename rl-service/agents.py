import numpy as np
from environment import SmartHomeEnv

class DualAgentManager:
    """
    Manager interface for Dual-Agent Reinforcement Learning Policy predictions.
    Agent 1: Energy Supply Agent (Solar, Battery, Grid)
    Agent 2: Appliance Demand Agent (Scheduling & Load Shifting)
    """

    def __init__(self):
        self.env = SmartHomeEnv()

    def predict(self, solar_gen: float, load_demand: float, battery_soc: float, price: float, hour: int):
        # Determine Agent 1 Policy Action
        is_peak_price = price > 0.25 or (16 <= hour <= 21)
        is_solar_surplus = solar_gen > load_demand

        if is_solar_surplus and battery_soc < 95:
            agent1_action = "battery_charge"
            battery_rate_kw = round(solar_gen - load_demand, 2)
            agent1_reason = f"Surplus solar output ({solar_gen} kW) detected. Directing excess generation to charge battery."
        elif is_peak_price and battery_soc > 20:
            agent1_action = "battery_discharge"
            battery_rate_kw = round(min(load_demand, 2.0), 2)
            agent1_reason = f"High electricity tariff (${price}/kWh) during peak hour {hour}. Discharging battery to avoid expensive grid import."
        elif solar_gen >= load_demand:
            agent1_action = "solar_direct"
            battery_rate_kw = 0.0
            agent1_reason = f"Solar output ({solar_gen} kW) satisfies 100% of current household load."
        else:
            agent1_action = "grid_import"
            battery_rate_kw = 0.0
            agent1_reason = f"Solar & battery reserve insufficient for demand. Importing {round(load_demand - solar_gen, 2)} kW from utility grid."

        # Determine Agent 2 Policy Action
        if is_peak_price:
            agent2_action = "shift_appliance"
            shifted_apps = ["EV Charger", "Washing Machine"]
            recommended_window = "01:00 AM - 05:00 AM"
            agent2_reason = f"Peak electricity tariff period. Shifting flexible heavy loads to off-peak night window."
        elif load_demand > 5.5:
            agent2_action = "shed_non_essential_load"
            shifted_apps = ["Dishwasher"]
            recommended_window = "Immediate Pause"
            agent2_reason = f"Household load ({load_demand} kW) exceeds peak demand threshold. Deferring non-essential appliance operation."
        else:
            agent2_action = "maintain_schedule"
            shifted_apps = []
            recommended_window = "Normal Schedule"
            agent2_reason = f"Household load and grid tariff are within optimal operating bounds."

        # Compute estimated cost
        net_grid_kw = max(0.0, load_demand - solar_gen - (battery_rate_kw if agent1_action == "battery_discharge" else 0.0))
        estimated_cost = round(net_grid_kw * price, 2)

        return {
            "agent1": {
                "name": "Energy Supply Agent",
                "action": agent1_action,
                "batteryRateKw": battery_rate_kw,
                "reasoning": agent1_reason
            },
            "agent2": {
                "name": "Appliance Scheduling Agent",
                "action": agent2_action,
                "shiftedAppliances": shifted_apps,
                "recommendedOperatingWindow": recommended_window,
                "reasoning": agent2_reason
            },
            "estimatedCost": estimated_cost
        }
