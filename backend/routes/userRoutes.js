const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const users = await User.find().select('-email -password').sort({ points: -1 });
    res.json(users.map((u) => u.toPublicJSON()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/leaderboard', async (_req, res) => {
  try {
    const users = await User.find()
      .select('-email -password')
      .sort({ points: -1 })
      .limit(20);
    res.json(users.map((u) => u.toPublicJSON()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-email -password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.toPublicJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { location } = req.body;
    if (location) req.user.location = location;
    await req.user.save();
    res.json(req.user.toPublicJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
