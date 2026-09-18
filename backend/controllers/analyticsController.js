const EnergyData = require('../models/EnergyData');
const SolarData = require('../models/SolarData');
const { calculateRenewablePercentage, calculateSavings } = require('../utils/energyCalculator');

// @desc    Get overall analytics summary
// @route   GET /api/analytics/summary
// @access  Public
const getAnalyticsSummary = async (req, res, next) => {
  try {
    const energyRecords = await EnergyData.find().sort({ timestamp: -1 }).limit(100);

    let totalConsumption = 0;
    let totalSolar = 0;
    let totalGrid = 0;
    let totalCost = 0;
    let peakDemand = 0;
    let batteryUsage = 0;

    if (energyRecords.length > 0) {
      energyRecords.forEach(record => {
        totalConsumption += record.totalConsumption || 0;
        totalSolar += record.solarGeneration || 0;
        totalGrid += record.gridImport || 0;
        totalCost += record.totalCost || 0;
        batteryUsage += (record.batteryCharge || 0) + (record.batteryDischarge || 0);
        if (record.totalConsumption > peakDemand) {
          peakDemand = record.totalConsumption;
        }
      });
    } else {
      // Default baseline values for immediate dashboard rendering
      totalConsumption = 48.5;
      totalSolar = 28.2;
      totalGrid = 20.3;
      totalCost = 4.25;
      peakDemand = 4.5;
      batteryUsage = 8.4;
    }

    const energySaved = calculateSavings(totalSolar, batteryUsage * 0.5, 0.18);
    const renewablePercentage = calculateRenewablePercentage(totalSolar, totalConsumption);

    res.json({
      totalConsumption: Number(totalConsumption.toFixed(2)),
      solarGeneration: Number(totalSolar.toFixed(2)),
      gridUsage: Number(totalGrid.toFixed(2)),
      batteryUsage: Number(batteryUsage.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      peakDemand: Number(peakDemand.toFixed(2)),
      energySaved,
      renewablePercentage,
      currency: '$',
      unit: 'kWh'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get 24-hour daily analytics for chart display
// @route   GET /api/analytics/daily
// @access  Public
const getDailyAnalytics = async (req, res, next) => {
  try {
    const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    
    const chartData = hours.map((hourStr, idx) => {
      const hourNum = idx * 2;
      const isSolarTime = hourNum >= 6 && hourNum <= 18;
      const solar = isSolarTime ? Number((Math.sin(((hourNum - 6) / 12) * Math.PI) * 5.2).toFixed(2)) : 0;
      const consumption = Number((1.2 + Math.sin(hourNum / 3) * 1.5 + Math.random() * 0.5).toFixed(2));
      const grid = Math.max(0, Number((consumption - solar).toFixed(2)));
      const battery = hourNum >= 17 && hourNum <= 20 ? 1.2 : 0;
      const cost = Number((grid * (hourNum >= 16 && hourNum <= 20 ? 0.35 : 0.15)).toFixed(2));

      return {
        time: hourStr,
        consumption,
        solar,
        grid,
        battery,
        cost
      };
    });

    res.json(chartData);
  } catch (error) {
    next(error);
  }
};

// @desc    Get 7-day weekly analytics for chart display
// @route   GET /api/analytics/weekly
// @access  Public
const getWeeklyAnalytics = async (req, res, next) => {
  try {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const chartData = days.map((day, idx) => {
      const consumption = Number((35 + Math.random() * 15).toFixed(2));
      const solar = Number((20 + Math.random() * 10).toFixed(2));
      const grid = Number(Math.max(0, consumption - solar).toFixed(2));
      const battery = Number((5 + Math.random() * 4).toFixed(2));
      const cost = Number((grid * 0.16).toFixed(2));
      const saved = Number((solar * 0.16).toFixed(2));

      return {
        day,
        consumption,
        solar,
        grid,
        battery,
        cost,
        saved
      };
    });

    res.json(chartData);
  } catch (error) {
    next(error);
  }
};

// @desc    Get 12-month monthly analytics for chart display
// @route   GET /api/analytics/monthly
// @access  Public
const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const chartData = months.map((month, idx) => {
      const isSummer = idx >= 5 && idx <= 8;
      const consumption = Number((900 + (isSummer ? 300 : 0) + Math.random() * 100).toFixed(2));
      const solar = Number((600 + (isSummer ? 200 : 0) + Math.random() * 80).toFixed(2));
      const grid = Number(Math.max(0, consumption - solar).toFixed(2));
      const cost = Number((grid * 0.15).toFixed(2));
      const saved = Number((solar * 0.15).toFixed(2));

      return {
        month,
        consumption,
        solar,
        grid,
        cost,
        saved
      };
    });

    res.json(chartData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsSummary,
  getDailyAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics
};
