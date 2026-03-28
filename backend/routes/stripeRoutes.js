const express = require('express');
const { createCheckout } = require('../controllers/stripeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckout);

module.exports = router;
