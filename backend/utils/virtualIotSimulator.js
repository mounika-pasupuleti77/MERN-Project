/**
 * Virtual IoT Simulator for Smart Home Energy Telemetry
 * Generates realistic simulation data for solar generation, electricity prices,
 * household consumption, and battery state progression without physical sensors.
 */

const getSimulatedSolarGeneration = (weatherCondition = 'Sunny', hourOfDay = new Date().getHours()) => {
  // Peak solar generation happens between 10 AM (10) and 4 PM (16)
  if (hourOfDay < 6 || hourOfDay > 19) {
    return 0; // Night time
  }

  // Solar bell curve approximation
  const peakFactor = Math.sin(((hourOfDay - 6) / 13) * Math.PI); // 0 at 6 AM/7 PM, 1 at 12:30 PM
  let baseKw = 6.0 * peakFactor; // Max 6kW solar system

  switch (weatherCondition) {
    case 'Sunny':
      baseKw *= (0.85 + Math.random() * 0.15); // 85% - 100% capacity
      break;
    case 'Cloudy':
      baseKw *= (0.20 + Math.random() * 0.20); // 20% - 40% capacity
      break;
    case 'Variable':
      baseKw *= (0.30 + Math.random() * 0.60); // 30% - 90% capacity
      break;
    default:
      baseKw *= 0.8;
  }

  return Number(Math.max(0, baseKw).toFixed(2));
};

const getSimulatedElectricityPrice = (hourOfDay = new Date().getHours()) => {
  // Time of Use (TOU) pricing model ($/kWh)
  // Off-Peak: 00:00 - 07:00 -> Low price ($0.08 - $0.10)
  // Mid-Peak: 07:00 - 16:00, 21:00 - 24:00 -> Medium price ($0.15 - $0.18)
  // On-Peak:  16:00 - 21:00 -> High price ($0.32 - $0.38)

  let pricePerKWh = 0.15;
  let category = 'Medium';

  if (hourOfDay >= 0 && hourOfDay < 7) {
    pricePerKWh = 0.08 + Math.random() * 0.02;
    category = 'Low';
  } else if (hourOfDay >= 16 && hourOfDay < 21) {
    pricePerKWh = 0.32 + Math.random() * 0.06;
    category = 'High';
  } else {
    pricePerKWh = 0.15 + Math.random() * 0.03;
    category = 'Medium';
  }

  return {
    pricePerKWh: Number(pricePerKWh.toFixed(3)),
    priceCategory: category
  };
};

const getSimulatedHouseholdDemand = (activeAppliances = []) => {
  // Base background load (fridge, standby electronics, router, lights): 0.4 kW - 0.8 kW
  let baseDemand = 0.5 + (Math.random() * 0.3);

  // Add power consumption of active appliances
  const applianceDemand = activeAppliances.reduce((sum, app) => {
    if (app.status === 'ON') {
      return sum + (Number(app.powerRating) || 0);
    }
    return sum;
  }, 0);

  return Number((baseDemand + applianceDemand).toFixed(2));
};

module.exports = {
  getSimulatedSolarGeneration,
  getSimulatedElectricityPrice,
  getSimulatedHouseholdDemand
};
