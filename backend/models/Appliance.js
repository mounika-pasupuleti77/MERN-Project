const mongoose = require('mongoose');

const applianceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Appliance name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['heavy', 'flexible', 'critical', 'standard'],
    default: 'standard'
  },
  powerRating: {
    type: Number, // kW
    required: [true, 'Power rating in kW is required'],
    min: [0, 'Power rating cannot be negative']
  },
  duration: {
    type: Number, // operating duration in hours
    default: 1
  },
  priority: {
    type: Number, // 1 (lowest) to 5 (highest)
    min: 1,
    max: 5,
    default: 3
  },
  status: {
    type: String,
    enum: ['ON', 'OFF'],
    default: 'OFF'
  },
  preferredStartTime: {
    type: String, // e.g. "14:00"
    default: '00:00'
  },
  preferredEndTime: {
    type: String, // e.g. "18:00"
    default: '23:59'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appliance', applianceSchema);
