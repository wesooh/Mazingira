const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createPost,
  getFeed,
  getPost,
  getNearbyPosts,
  likePost,
  addComment,
  updateStatus,
  getUserPosts,
  getImpactStats
} = require('../controllers/postController');

const router = express.Router();

// Public routes
router.get('/feed', getFeed);
router.get('/stats/impact', getImpactStats);
router.get('/nearby', getNearbyPosts);
router.get('/user/:userId', getUserPosts);
router.get('/:id', getPost);

// Protected routes (require authentication)
router.post('/create', protect, createPost);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.put('/:id/status', protect, updateStatus);

module.exports = router;