const express = require('express');
const router = express.Router();
const { getCurrentEnergy, getEnergyHistory, logEnergyData } = require('../controllers/energyController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/current', getCurrentEnergy);
router.get('/history', getEnergyHistory);
router.post('/', optionalAuth, logEnergyData);

module.exports = router;
