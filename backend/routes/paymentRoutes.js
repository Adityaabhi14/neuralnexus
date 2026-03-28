const express = require('express');
const { subscribePayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/subscribe', protect, subscribePayment);

module.exports = router;
