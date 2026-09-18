const express = require('express');
const router = express.Router();
const {
  getAnalyticsSummary,
  getDailyAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics
} = require('../controllers/analyticsController');

router.get('/summary', getAnalyticsSummary);
router.get('/daily', getDailyAnalytics);
router.get('/weekly', getWeeklyAnalytics);
router.get('/monthly', getMonthlyAnalytics);

module.exports = router;
