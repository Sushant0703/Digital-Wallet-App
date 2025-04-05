
const express = require('express');
const { register, login, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getUserProfile);

module.exports = router;
