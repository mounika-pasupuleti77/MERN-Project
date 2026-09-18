const Appliance = require('../models/Appliance');
const Battery = require('../models/Battery');
const Schedule = require('../models/Schedule');
const { getSimulatedSolarGeneration, getSimulatedElectricityPrice, getSimulatedHouseholdDemand } = require('../utils/virtualIotSimulator');
const { calculateEnergyCost, calculateNetGrid } = require('../utils/energyCalculator');

// @desc    Get consolidated dashboard metrics in one call
// @route   GET /api/dashboard
// @access  Public
const getDashboardData = async (req, res, next) => {
  try {
    const currentHour = new Date().getHours();

    // Active & scheduled appliances
    const activeAppliances = await Appliance.find({ status: 'ON' });
    const scheduledSchedules = await Schedule.find({ status: 'scheduled' });

    // Total household demand
    const totalConsumption = getSimulatedHouseholdDemand(activeAppliances);

    // Solar generation
    const solarGeneration = getSimulatedSolarGeneration('Sunny', currentHour);

    // Battery state
    let battery = await Battery.findOne();
    if (!battery) {
      battery = await Battery.create({ capacity: 10, currentSOC: 72, minSOC: 15, maxSOC: 95 });
    }

    let batteryDischarge = battery.status === 'discharging' ? 1.5 : 0;
    let batteryCharge = battery.status === 'charging' ? 1.5 : 0;

    // Price
    const priceInfo = getSimulatedElectricityPrice(currentHour);

    // Grid import/export calculation
    const netGrid = calculateNetGrid(totalConsumption, solarGeneration, batteryDischarge, batteryCharge);
    const todayCost = calculateEnergyCost(netGrid.gridImport * 8, priceInfo.pricePerKWh); // Approx cumulative daily cost

    res.json({
      timestamp: new Date(),
      totalConsumption,
      solarGeneration,
      gridImport: netGrid.gridImport,
      gridExport: netGrid.gridExport,
      batterySOC: battery.currentSOC,
      batteryStatus: battery.status,
      currentPrice: priceInfo.pricePerKWh,
      priceCategory: priceInfo.priceCategory,
      todayCost,
      activeAppliances: activeAppliances.length,
      scheduledAppliances: scheduledSchedules.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData
};
