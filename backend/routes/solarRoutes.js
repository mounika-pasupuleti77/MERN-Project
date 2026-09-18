const express = require('express');
const router = express.Router();
const { getCurrentSolar, getSolarHistory, logSolarData } = require('../controllers/solarController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/current', getCurrentSolar);
router.get('/history', getSolarHistory);
router.post('/', optionalAuth, logSolarData);

module.exports = router;
