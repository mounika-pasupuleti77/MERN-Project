const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  applianceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appliance',
    required: true
  },
  applianceName: {
    type: String
  },
  scheduledStart: {
    type: String, // format "YYYY-MM-DD THH:mm" or "HH:mm"
    required: true
  },
  scheduledEnd: {
    type: String,
    required: true
  },
  powerConsumption: {
    type: Number, // kW
    default: 1.0
  },
  source: {
    type: String,
    enum: ['Manual', 'RL Agent', 'Automatic'],
    default: 'Manual'
  },
  status: {
    type: String,
    enum: ['scheduled', 'running', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  estimatedCost: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);
