const express = require('express');
const Tree = require('../models/Tree');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { awardPoints } = require('../utils/points');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const trees = await Tree.find()
      .populate('planter', 'username location badges')
      .sort({ createdAt: -1 });
    res.json(
      trees.map((t) => ({
        id: t._id,
        species: t.species,
        description: t.description,
        image: t.image,
        location: t.location,
        latitude: t.latitude,
        longitude: t.longitude,
        planter: t.planter?.toPublicJSON?.() || t.planter,
        createdAt: t.createdAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { species, description, location, latitude, longitude } = req.body;

    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Photo is required' });
    }

    const tree = await Tree.create({
      planter: req.user._id,
      species: species || 'Unknown',
      description,
      location,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      image: `/uploads/${req.file.filename}`,
    });

    req.user.treesPlanted += 1;
    await awardPoints(req.user, 'tree');

    await Post.create({
      author: req.user._id,
      content: `🌳 Planted a ${species || 'tree'}!\n\n${description || 'Making our environment greener.'}`,
      location,
      image: tree.image,
      type: 'tree',
    });

    const populated = await Tree.findById(tree._id).populate(
      'planter',
      'username location badges'
    );

    res.status(201).json({
      id: populated._id,
      species: populated.species,
      description: populated.description,
      image: populated.image,
      location: populated.location,
      latitude: populated.latitude,
      longitude: populated.longitude,
      planter: populated.planter.toPublicJSON(),
      createdAt: populated.createdAt,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
