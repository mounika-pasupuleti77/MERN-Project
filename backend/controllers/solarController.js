const SolarData = require('../models/SolarData');
const { getSimulatedSolarGeneration } = require('../utils/virtualIotSimulator');

// @desc    Get current solar generation based on weather conditions
// @route   GET /api/solar/current
// @access  Public
const getCurrentSolar = async (req, res, next) => {
  try {
    const weatherCondition = req.query.weather || 'Sunny';
    const hour = new Date().getHours();

    const currentGeneration = getSimulatedSolarGeneration(weatherCondition, hour);
    const forecastGeneration = getSimulatedSolarGeneration(weatherCondition, (hour + 2) % 24);

    res.json({
      timestamp: new Date(),
      weatherCondition,
      generation: currentGeneration,
      unit: 'kW',
      forecastGeneration,
      peakCapacity: 6.0
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get solar generation history
// @route   GET /api/solar/history
// @access  Public
const getSolarHistory = async (req, res, next) => {
  try {
    let history = await SolarData.find().sort({ timestamp: -1 }).limit(24);

    if (history.length === 0) {
      const simulatedSolar = [];
      const now = new Date();
      const conditions = ['Sunny', 'Sunny', 'Variable', 'Cloudy'];

      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 3600 * 1000);
        const hour = time.getHours();
        const weather = conditions[i % conditions.length];
        const gen = getSimulatedSolarGeneration(weather, hour);

        simulatedSolar.push({
          timestamp: time,
          generation: gen,
          weatherCondition: weather,
          forecastGeneration: Number((gen * 1.1).toFixed(2))
        });
      }

      await SolarData.insertMany(simulatedSolar);
      history = await SolarData.find().sort({ timestamp: -1 }).limit(24);
    }

    res.json(history.reverse());
  } catch (error) {
    next(error);
  }
};

// @desc    Log new solar generation data
// @route   POST /api/solar
// @access  Public
const logSolarData = async (req, res, next) => {
  try {
    const { generation, weatherCondition, forecastGeneration } = req.body;

    const solarEntry = await SolarData.create({
      generation: generation || 0,
      weatherCondition: weatherCondition || 'Sunny',
      forecastGeneration: forecastGeneration || 0,
      userId: req.user ? req.user._id : null
    });

    res.status(201).json(solarEntry);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentSolar,
  getSolarHistory,
  logSolarData
};
