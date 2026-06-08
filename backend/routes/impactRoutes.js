const express = require('express');
const User = require('../models/User');
const Report = require('../models/Report');
const Tree = require('../models/Tree');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/community', async (_req, res) => {
  try {
    const [totalUsers, totalReports, totalTrees, totalPosts, openReports, resolvedReports] =
      await Promise.all([
        User.countDocuments(),
        Report.countDocuments(),
        Tree.countDocuments(),
        Post.countDocuments(),
        Report.countDocuments({ status: 'open' }),
        Report.countDocuments({ status: 'resolved' }),
      ]);

    const totalPoints = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$points' } } },
    ]);

    res.json({
      totalUsers,
      totalReports,
      totalTrees,
      totalPosts,
      openReports,
      resolvedReports,
      totalCommunityPoints: totalPoints[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = req.user.toPublicJSON();
    const [myReports, myTrees, myPosts] = await Promise.all([
      Report.countDocuments({ reporter: req.user._id }),
      Tree.countDocuments({ planter: req.user._id }),
      Post.countDocuments({ author: req.user._id }),
    ]);

    res.json({
      ...user,
      myReports,
      myTrees,
      myPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
