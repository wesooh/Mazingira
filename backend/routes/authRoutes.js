const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token - FIXED expiresIn format
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'  // Changed from process.env.JWT_EXPIRE to string literal
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, location } = req.body;
    
    console.log('Registration attempt:', { username, email, location }); // Debug log
    
    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ 
        message: userExists.email === email ? 'Email already registered' : 'Username already taken' 
      });
    }
    
    // Create user
    const user = await User.create({
      username,
      email,
      password,
      location
    });
    
    console.log('User created:', user._id); // Debug log
    
    // Return response (hide sensitive data)
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', email); // Debug log
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    console.log('User logged in:', user._id); // Debug log
    
    // Return response
    res.json({
      success: true,
      token: generateToken(user._id),
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
router.get('/me', protect, async (req, res) => {
  try {
    res.json({ user: req.user.toPublicJSON() });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;