const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: 200,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 1000,
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  latitude: Number,
  longitude: Number,
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reportSchema.methods.toPublicJSON = async function () {
  await this.populate('reporter', 'username location badges');
  const reporter = this.reporter?.toPublicJSON?.() || this.reporter;
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    image: this.image,
    location: this.location,
    latitude: this.latitude,
    longitude: this.longitude,
    status: this.status,
    reporter,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Report', reportSchema);
