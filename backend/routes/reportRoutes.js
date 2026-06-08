const express = require('express');
const Report = require('../models/Report');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { awardPoints } = require('../utils/points');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'username location badges')
      .sort({ createdAt: -1 });
    res.json(
      reports.map((r) => ({
        id: r._id,
        title: r.title,
        description: r.description,
        image: r.image,
        location: r.location,
        latitude: r.latitude,
        longitude: r.longitude,
        status: r.status,
        reporter: r.reporter?.toPublicJSON?.() || r.reporter,
        createdAt: r.createdAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, latitude, longitude } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: 'Title, description, and location are required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Photo is required' });
    }

    const report = await Report.create({
      reporter: req.user._id,
      title,
      description,
      location,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      image: `/uploads/${req.file.filename}`,
    });

    req.user.reportsMade += 1;
    await awardPoints(req.user, 'report');

    await Post.create({
      author: req.user._id,
      content: `🚨 Environmental Issue: ${title}\n\n${description}`,
      location,
      image: report.image,
      type: 'report',
    });

    const populated = await Report.findById(report._id).populate(
      'reporter',
      'username location badges'
    );

    res.status(201).json({
      id: populated._id,
      title: populated.title,
      description: populated.description,
      image: populated.image,
      location: populated.location,
      latitude: populated.latitude,
      longitude: populated.longitude,
      status: populated.status,
      reporter: populated.reporter.toPublicJSON(),
      createdAt: populated.createdAt,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
