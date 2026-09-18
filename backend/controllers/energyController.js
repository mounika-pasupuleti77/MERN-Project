const EnergyData = require('../models/EnergyData');
const Appliance = require('../models/Appliance');
const Battery = require('../models/Battery');
const { getSimulatedSolarGeneration, getSimulatedElectricityPrice, getSimulatedHouseholdDemand } = require('../utils/virtualIotSimulator');
const { calculateEnergyCost, calculateNetGrid, calculateRenewablePercentage } = require('../utils/energyCalculator');

// @desc    Get current real-time energy status
// @route   GET /api/energy/current
// @access  Public
const getCurrentEnergy = async (req, res, next) => {
  try {
    const currentHour = new Date().getHours();
    
    // Get active appliances to compute consumption
    const appliances = await Appliance.find({ status: 'ON' });
    const totalConsumption = getSimulatedHouseholdDemand(appliances);

    // Get current solar generation
    const solarGeneration = getSimulatedSolarGeneration('Sunny', currentHour);

    // Get battery status
    let battery = await Battery.findOne();
    if (!battery) {
      battery = await Battery.create({ capacity: 10, currentSOC: 50, minSOC: 15, maxSOC: 95 });
    }

    let batteryDischarge = 0;
    let batteryCharge = 0;
    if (battery.status === 'discharging') batteryDischarge = 1.5;
    if (battery.status === 'charging') batteryCharge = 1.5;

    // Get price info
    const priceInfo = getSimulatedElectricityPrice(currentHour);

    // Calculate grid import / export & cost
    const netGrid = calculateNetGrid(totalConsumption, solarGeneration, batteryDischarge, batteryCharge);
    const estimatedCost = calculateEnergyCost(netGrid.gridImport, priceInfo.pricePerKWh);
    const renewablePercentage = calculateRenewablePercentage(solarGeneration, totalConsumption);

    res.json({
      timestamp: new Date(),
      totalConsumption,
      gridImport: netGrid.gridImport,
      gridExport: netGrid.gridExport,
      solarGeneration,
      batterySOC: battery.currentSOC,
      batteryStatus: battery.status,
      electricityPrice: priceInfo.pricePerKWh,
      priceCategory: priceInfo.priceCategory,
      totalCost: estimatedCost,
      renewablePercentage,
      activeAppliancesCount: appliances.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get energy historical data (24h or past logs)
// @route   GET /api/energy/history
// @access  Public
const getEnergyHistory = async (req, res, next) => {
  try {
    let history = await EnergyData.find().sort({ timestamp: -1 }).limit(24);

    // Seed/Simulate 24h history if empty
    if (history.length === 0) {
      const simulatedHistory = [];
      const now = new Date();

      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 3600 * 1000);
        const hour = time.getHours();
        
        const solar = getSimulatedSolarGeneration('Sunny', hour);
        const priceObj = getSimulatedElectricityPrice(hour);
        const consumption = Number((1.2 + Math.sin(hour / 3) * 0.8 + Math.random() * 0.4).toFixed(2));
        const grid = Math.max(0, Number((consumption - solar).toFixed(2)));
        const cost = calculateEnergyCost(grid, priceObj.pricePerKWh);

        simulatedHistory.push({
          timestamp: time,
          totalConsumption: consumption,
          gridImport: grid,
          gridExport: solar > consumption ? Number((solar - consumption).toFixed(2)) : 0,
          solarGeneration: solar,
          batteryCharge: hour >= 10 && hour <= 14 ? 1.0 : 0,
          batteryDischarge: hour >= 17 && hour <= 20 ? 1.0 : 0,
          electricityPrice: priceObj.pricePerKWh,
          totalCost: cost
        });
      }

      await EnergyData.insertMany(simulatedHistory);
      history = await EnergyData.find().sort({ timestamp: -1 }).limit(24);
    }

    res.json(history.reverse()); // Chronological order
  } catch (error) {
    next(error);
  }
};

// @desc    Create/log an energy data entry
// @route   POST /api/energy
// @access  Public
const logEnergyData = async (req, res, next) => {
  try {
    const { totalConsumption, solarGeneration, batteryCharge, batteryDischarge, electricityPrice } = req.body;

    const netGrid = calculateNetGrid(totalConsumption, solarGeneration, batteryDischarge, batteryCharge);
    const totalCost = calculateEnergyCost(netGrid.gridImport, electricityPrice || 0.15);

    const energyEntry = await EnergyData.create({
      totalConsumption: totalConsumption || 0,
      gridImport: netGrid.gridImport,
      gridExport: netGrid.gridExport,
      solarGeneration: solarGeneration || 0,
      batteryCharge: batteryCharge || 0,
      batteryDischarge: batteryDischarge || 0,
      electricityPrice: electricityPrice || 0.15,
      totalCost,
      userId: req.user ? req.user._id : null
    });

    res.status(201).json(energyEntry);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentEnergy,
  getEnergyHistory,
  logEnergyData
};
