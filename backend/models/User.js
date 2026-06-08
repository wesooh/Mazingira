const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  points: {
    type: Number,
    default: 0
  },
  treesPlanted: {
    type: Number,
    default: 0
  },
  reportsMade: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String,
    enum: ['Eco-Warrior', 'Tree Planter', 'Issue Reporter', 'Green Guardian']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hide private info when sending user data
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    username: this.username,
    location: this.location,
    points: this.points,
    treesPlanted: this.treesPlanted,
    reportsMade: this.reportsMade,
    badges: this.badges,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);