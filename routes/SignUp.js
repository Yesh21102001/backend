const express = require('express');
const { signUp } = require('../controllers/SignUp');
const router = express.Router();

// Sign up route
router.post('/signup', signUp);

module.exports = router;
