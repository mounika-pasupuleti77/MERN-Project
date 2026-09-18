const express = require('express');
const router = express.Router();
const {
  getAppliances,
  createAppliance,
  getApplianceById,
  updateAppliance,
  deleteAppliance,
  toggleApplianceStatus
} = require('../controllers/applianceController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.route('/')
  .get(optionalAuth, getAppliances)
  .post(optionalAuth, createAppliance);

router.route('/:id')
  .get(getApplianceById)
  .put(updateAppliance)
  .delete(deleteAppliance);

router.patch('/:id/status', toggleApplianceStatus);

module.exports = router;
