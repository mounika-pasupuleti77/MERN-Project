/**
 * Utility functions for smart home energy calculations
 */

/**
 * Calculates energy cost based on grid import and current electricity tariff
 */
const calculateEnergyCost = (gridImportKWh, pricePerKWh) => {
  const importEnergy = Math.max(0, Number(gridImportKWh) || 0);
  const price = Math.max(0, Number(pricePerKWh) || 0);
  return Number((importEnergy * price).toFixed(2));
};

/**
 * Calculates net grid power import (+) or export (-)
 */
const calculateNetGrid = (totalConsumption, solarGeneration, batteryDischarge = 0, batteryCharge = 0) => {
  const demand = Math.max(0, Number(totalConsumption) || 0) + Math.max(0, Number(batteryCharge) || 0);
  const supply = Math.max(0, Number(solarGeneration) || 0) + Math.max(0, Number(batteryDischarge) || 0);
  
  const net = demand - supply;
  return {
    gridImport: net > 0 ? Number(net.toFixed(2)) : 0,
    gridExport: net < 0 ? Number(Math.abs(net).toFixed(2)) : 0
  };
};

/**
 * Calculates percentage of total consumption supplied by solar energy
 */
const calculateRenewablePercentage = (solarGeneration, totalConsumption) => {
  if (!totalConsumption || totalConsumption <= 0) return 100;
  const percentage = (solarGeneration / totalConsumption) * 100;
  return Math.min(100, Number(percentage.toFixed(1)));
};

/**
 * Calculates financial savings achieved using Solar + Battery vs 100% Grid dependence
 */
const calculateSavings = (solarGeneration, batteryDischarge, pricePerKWh) => {
  const cleanEnergyUsed = (Number(solarGeneration) || 0) + (Number(batteryDischarge) || 0);
  const price = Number(pricePerKWh) || 0.15;
  return Number((cleanEnergyUsed * price).toFixed(2));
};

module.exports = {
  calculateEnergyCost,
  calculateNetGrid,
  calculateRenewablePercentage,
  calculateSavings
};
