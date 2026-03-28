const express = require('express');
const { sendVerificationEmail } = require('../controllers/emailController');

const router = express.Router();

router.post('/send', sendVerificationEmail);

module.exports = router;
