const express = require('express');
const { upgradeToPremium } = require('../controllers/premiumController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/upgrade', protect, upgradeToPremium);

module.exports = router;
