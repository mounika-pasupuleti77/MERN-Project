const mongoose = require('mongoose');

const solarDataSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  generation: {
    type: Number, // kW output
    required: true,
    default: 0
  },
  weatherCondition: {
    type: String,
    enum: ['Sunny', 'Cloudy', 'Variable'],
    default: 'Sunny'
  },
  forecastGeneration: {
    type: Number, // kW expected
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

module.exports = mongoose.model('SolarData', solarDataSchema);
