
const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Protected route to get user by UPI ID
router.get('/by-upi/:upiId', protect, async (req, res) => {
  try {
    const upiId = req.params.upiId;
    
    // Find user by UPI ID
    const user = await User.findOne({ upiId }).select('name upiId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return basic user info
    res.json({
      name: user.name,
      upiId: user.upiId
    });
    
  } catch (error) {
    console.error('Get user by UPI error:', error);
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
});

module.exports = router;
