const express = require('express');
const { login, forgotPassword, verifyOtpAndResetPassword } = require('../controllers/login');
const router = express.Router();

// Login route
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtpAndResetPassword);

module.exports = router;