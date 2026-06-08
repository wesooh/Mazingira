const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (only public info)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({})
      .select('username location points treesPlanted reportsMade badges')
      .sort({ points: -1 });
    
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user by ID (public info only)
router.get('/:id', async (req, res) => {
  try {
    // Validate if ID is a valid MongoDB ObjectId
    const isValidId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    if (!isValidId) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    const user = await User.findById(req.params.id)
      .select('username location points treesPlanted reportsMade badges createdAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/leaderboard/top
// @desc    Get top 10 users by points
router.get('/leaderboard/top', async (req, res) => {
  try {
    const topUsers = await User.find({})
      .select('username location points treesPlanted reportsMade')
      .sort({ points: -1 })
      .limit(10);
    
    res.json({ leaderboard: topUsers });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;