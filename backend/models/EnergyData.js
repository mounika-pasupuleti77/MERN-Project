const mongoose = require('mongoose');

const energyDataSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  totalConsumption: {
    type: Number, // kWh
    required: true,
    default: 0
  },
  gridImport: {
    type: Number, // kWh
    default: 0
  },
  gridExport: {
    type: Number, // kWh
    default: 0
  },
  solarGeneration: {
    type: Number, // kWh
    default: 0
  },
  batteryCharge: {
    type: Number, // kWh
    default: 0
  },
  batteryDischarge: {
    type: Number, // kWh
    default: 0
  },
  electricityPrice: {
    type: Number, // per kWh
    default: 0.15
  },
  totalCost: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

module.exports = mongoose.model('EnergyData', energyDataSchema);
