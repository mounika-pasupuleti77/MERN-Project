const express = require('express');
const router = express.Router();
const {
  getBatteryStatus,
  updateBattery,
  chargeBattery,
  dischargeBattery
} = require('../controllers/batteryController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.route('/')
  .get(optionalAuth, getBatteryStatus)
  .put(optionalAuth, updateBattery);

router.post('/charge', optionalAuth, chargeBattery);
router.post('/discharge', optionalAuth, dischargeBattery);

module.exports = router;
