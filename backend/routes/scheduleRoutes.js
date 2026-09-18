const express = require('express');
const router = express.Router();
const {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.route('/')
  .get(optionalAuth, getSchedules)
  .post(optionalAuth, createSchedule);

router.route('/:id')
  .put(optionalAuth, updateSchedule)
  .delete(optionalAuth, deleteSchedule);

module.exports = router;
