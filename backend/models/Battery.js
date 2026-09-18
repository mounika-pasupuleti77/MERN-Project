const mongoose = require('mongoose');

const batterySchema = new mongoose.Schema({
  capacity: {
    type: Number, // kWh
    default: 10
  },
  currentSOC: {
    type: Number, // State of Charge (%)
    default: 50,
    min: 0,
    max: 100
  },
  minSOC: {
    type: Number, // %
    default: 15
  },
  maxSOC: {
    type: Number, // %
    default: 95
  },
  chargeRate: {
    type: Number, // kW
    default: 3.3
  },
  dischargeRate: {
    type: Number, // kW
    default: 3.3
  },
  status: {
    type: String,
    enum: ['idle', 'charging', 'discharging'],
    default: 'idle'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Battery', batterySchema);
