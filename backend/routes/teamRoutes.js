const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Team = require('../models/Team');

// Public routes
router.get('/public', async (req, res) => {
  try {
    const team = await Team.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Protected admin routes
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const team = await Team.find({}).sort({ order: 1 });
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team member not found' });
    Object.assign(team, req.body);
    await team.save();
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
