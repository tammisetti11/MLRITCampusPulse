const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Test route
router.get('/test', (req, res) => {
    res.send('Auth route working');
});

module.exports = router;
