const express = require('express');
const router = express.Router();
const { getRlDecision } = require('../controllers/rlController');

router.post('/decision', getRlDecision);

module.exports = router;
