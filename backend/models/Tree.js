const mongoose = require('mongoose');

const treeSchema = new mongoose.Schema({
  planter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  species: {
    type: String,
    default: 'Unknown',
  },
  description: String,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

treeSchema.methods.toPublicJSON = async function () {
  await this.populate('planter', 'username location badges');
  const planter = this.planter?.toPublicJSON?.() || this.planter;
  return {
    id: this._id,
    species: this.species,
    description: this.description,
    image: this.image,
    location: this.location,
    latitude: this.latitude,
    longitude: this.longitude,
    planter,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Tree', treeSchema);
