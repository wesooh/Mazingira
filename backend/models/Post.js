const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['issue', 'tree'],
    required: [true, 'Post type is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  photoUrl: {
    type: String,
    required: [true, 'Photo is required for verification']
  },
  photoPublicId: {
    type: String, // For Cloudinary management
    default: ''
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  pointsAwarded: {
    type: Number,
    default: 0
  },
  interventionNeeded: {
    type: Boolean,
    default: false
  },
  interventionType: {
    type: String,
    enum: ['cleanup', 'authorities', 'volunteers', 'funding', 'other'],
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
postSchema.index({ createdAt: -1 });
postSchema.index({ location: 1 });
postSchema.index({ type: 1 });

module.exports = mongoose.model('Post', postSchema);