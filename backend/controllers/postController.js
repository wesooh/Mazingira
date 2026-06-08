const Post = require('../models/Post');
const User = require('../models/User');

// Award points based on action type
const calculatePoints = (type, interventionNeeded) => {
  if (type === 'tree') return 50; // Planting tree
  if (type === 'issue' && interventionNeeded) return 30; // Issue needing help
  return 20; // Simple report
};

// @desc    Create a new post (issue or tree)
// @route   POST /api/posts/create
const createPost = async (req, res) => {
  try {
    const { type, title, description, photoUrl, location, coordinates, interventionNeeded, interventionType } = req.body;
    
    // Calculate points
    const pointsAwarded = calculatePoints(type, interventionNeeded);
    
    // Create post
    const post = await Post.create({
      type,
      title,
      description,
      photoUrl: photoUrl || '',
      location,
      coordinates: coordinates || {},
      userId: req.user._id,
      username: req.user.username,
      pointsAwarded,
      interventionNeeded: interventionNeeded || false,
      interventionType: interventionType || null,
      status: 'pending'
    });
    
    // Update user points and stats
    const updateData = {
      $inc: { points: pointsAwarded }
    };
    
    if (type === 'tree') {
      updateData.$inc.treesPlanted = 1;
      // Award tree planter badge if not already have
      if (!req.user.badges.includes('Tree Planter') && req.user.treesPlanted + 1 >= 1) {
        updateData.$push = { badges: 'Tree Planter' };
      }
    } else {
      updateData.$inc.reportsMade = 1;
      // Award issue reporter badge
      if (!req.user.badges.includes('Issue Reporter') && req.user.reportsMade + 1 >= 1) {
        if (!updateData.$push) updateData.$push = {};
        updateData.$push.badges = 'Issue Reporter';
      }
    }
    
    // Award eco-warrior badge for 100+ points
    if (!req.user.badges.includes('Eco-Warrior') && req.user.points + pointsAwarded >= 100) {
      if (!updateData.$push) updateData.$push = {};
      updateData.$push.badges = 'Eco-Warrior';
    }
    
    await User.findByIdAndUpdate(req.user._id, updateData);
    
    res.status(201).json({
      success: true,
      post,
      pointsEarned: pointsAwarded
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public timeline feed (all posts)
// @route   GET /api/posts/feed
const getFeed = async (req, res) => {
  try {
    const { limit = 20, type, location } = req.query;
    
    let filter = {};
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'username location points');
    
    res.json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'username location points badges');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get posts by location (near me)
// @route   GET /api/posts/nearby
const getNearbyPosts = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query; // radius in km
    
    // Simple location-based filtering (you can enhance with geospatial queries)
    const posts = await Post.find({
      'coordinates.lat': { $exists: true },
      'coordinates.lng': { $exists: true }
    }).limit(50);
    
    // Filter posts within radius (simplified)
    const nearby = posts.filter(post => {
      if (!post.coordinates.lat) return false;
      const distance = Math.sqrt(
        Math.pow(post.coordinates.lat - lat, 2) + 
        Math.pow(post.coordinates.lng - lng, 2)
      ) * 111; // Rough km conversion
      return distance <= radius;
    });
    
    res.json({ success: true, count: nearby.length, posts: nearby });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/unlike a post
// @route   PUT /api/posts/:id/like
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const hasLiked = post.likes.includes(req.user._id);
    
    if (hasLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    
    await post.save();
    
    res.json({ success: true, likes: post.likes.length, hasLiked: !hasLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.comments.push({
      userId: req.user._id,
      username: req.user.username,
      text: text.trim()
    });
    
    await post.save();
    
    res.json({ 
      success: true, 
      comment: post.comments[post.comments.length - 1] 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update post status (for interventions)
// @route   PUT /api/posts/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get impact stats (all users aggregated)
// @route   GET /api/posts/stats/impact
const getImpactStats = async (req, res) => {
  try {
    const totalTrees = await Post.countDocuments({ type: 'tree' });
    const totalIssues = await Post.countDocuments({ type: 'issue' });
    const resolvedIssues = await Post.countDocuments({ type: 'issue', status: 'resolved' });
    const pendingInterventions = await Post.countDocuments({ 
      type: 'issue', 
      interventionNeeded: true,
      status: { $ne: 'resolved' }
    });
    
    res.json({
      success: true,
      stats: {
        totalTrees,
        totalIssues,
        resolvedIssues,
        pendingInterventions,
        resolutionRate: totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getFeed,
  getPost,
  getNearbyPosts,
  likePost,
  addComment,
  updateStatus,
  getUserPosts,
  getImpactStats
};