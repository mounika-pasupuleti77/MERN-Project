/**
 * Controller for Dual-Agent Reinforcement Learning Integration
 * Interfaces with external Python RL Gymnasium Service or executes intelligent fallback rules.
 */

// @desc    Process RL state and return Dual-Agent decision
// @route   POST /api/rl/decision
// @access  Public
const getRlDecision = async (req, res, next) => {
  try {
    const {
      solarGeneration = 0,
      loadDemand = 0,
      batterySOC = 50,
      electricityPrice = 0.15,
      time = new Date().getHours(),
      appliances = []
    } = req.body;

    const rlServiceUrl = process.env.RL_SERVICE_URL;

    // 1. Try communicating with Python Gymnasium RL Service if configured
    if (rlServiceUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 sec timeout

        const response = await fetch(rlServiceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ solarGeneration, loadDemand, batterySOC, electricityPrice, time, appliances }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const pyDecision = await response.json();
          return res.json({
            ...pyDecision,
            source: 'Python Gymnasium RL Service'
          });
        }
      } catch (err) {
        // Python RL service unreachable or timed out; fall back to local rule-based agent logic
      }
    }

    // 2. Intelligent Dual-Agent Heuristic Rule Engine (Fallback)
    // Agent 1: Energy Supply Agent (Solar, Battery, Grid)
    let agent1Action = 'grid_import';
    let agent1Reason = 'Normal grid operation';
    let batteryKw = 0;

    const isPeakPrice = electricityPrice > 0.25 || time >= 16 && time <= 21;
    const isSolarExcess = solarGeneration > loadDemand;

    if (isSolarExcess && batterySOC < 95) {
      agent1Action = 'battery_charge';
      batteryKw = Number((solarGeneration - loadDemand).toFixed(2));
      agent1Reason = `Excess solar generation (${solarGeneration} kW) available. Charging battery.`;
    } else if (isPeakPrice && batterySOC > 20) {
      agent1Action = 'battery_discharge';
      batteryKw = Number(Math.min(loadDemand, 2.5).toFixed(2));
      agent1Reason = `High peak electricity price ($${electricityPrice}/kWh). Discharging battery to lower grid import.`;
    } else if (solarGeneration >= loadDemand) {
      agent1Action = 'solar_direct';
      agent1Reason = `Solar generation (${solarGeneration} kW) fully covers household demand.`;
    } else {
      agent1Action = 'grid_import';
      agent1Reason = `Solar & battery insufficient for current demand. Importing ${Number((loadDemand - solarGeneration).toFixed(2))} kW from grid.`;
    }

    // Agent 2: Appliance Demand & Scheduling Agent (Load Shifting & Peak Reduction)
    let agent2Action = 'maintain_schedule';
    let shiftedApps = [];
    let agent2Reason = 'Current appliance load is within optimal limits.';

    if (isPeakPrice) {
      agent2Action = 'shift_appliance';
      shiftedApps = ['EV Charger', 'Washing Machine'];
      agent2Reason = `Peak price period detected (Hour ${time}). Deferring heavy flexible appliances to off-peak hours (01:00 AM).`;
    } else if (loadDemand > 6.0) {
      agent2Action = 'shed_non_essential_load';
      shiftedApps = ['Dishwasher'];
      agent2Reason = `Total household demand (${loadDemand} kW) exceeds peak demand threshold. Pausing non-essential appliances.`;
    }

    // Estimated cost computation
    const netGridKw = Math.max(0, loadDemand - solarGeneration - (agent1Action === 'battery_discharge' ? batteryKw : 0));
    const estimatedCost = Number((netGridKw * electricityPrice).toFixed(2));

    res.json({
      timestamp: new Date(),
      agent1: {
        name: 'Energy Supply Agent',
        action: agent1Action,
        batteryRateKw: batteryKw,
        reasoning: agent1Reason
      },
      agent2: {
        name: 'Appliance Scheduling Agent',
        action: agent2Action,
        shiftedAppliances: shiftedApps,
        recommendedOperatingWindow: isPeakPrice ? '01:00 AM - 05:00 AM' : 'Immediate',
        reasoning: agent2Reason
      },
      estimatedCost,
      source: 'Node.js Dual-Agent Rule Engine'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRlDecision
};
