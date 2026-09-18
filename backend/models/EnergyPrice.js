const mongoose = require('mongoose');

const energyPriceSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  pricePerKWh: {
    type: Number,
    required: true,
    default: 0.15
  },
  priceCategory: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

module.exports = mongoose.model('EnergyPrice', energyPriceSchema);
