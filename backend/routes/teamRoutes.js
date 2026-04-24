const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadTeam } = require('../config/upload');
const Team = require('../models/Team');
const { uploadToGlobalStorage } = require('../utils/mediaStorage');

const API_URL = 'https://enimegebi-backend.onrender.com';
const getMediaUrl = (pathOrUrl) => {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${API_URL}${pathOrUrl}`;
};

// Public routes
router.get('/public', async (req, res) => {
  try {
    let team = await Team.find({ active: true }).sort({ order: 1 });
    team = team.map(t => ({
      ...t._doc,
      imageUrl: getMediaUrl(t.imageUrl || t.image)
    }));
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

router.post('/', uploadTeam.single('image'), async (req, res) => {
  try {
    const teamData = JSON.parse(req.body.team);
    if (req.file) {
      const uploadedUrl = await uploadToGlobalStorage(req.file.path, { folder: 'enimegebi/team' });
      const fallbackPath = `/uploads/team/${req.file.filename}`;
      const filePath = uploadedUrl || fallbackPath;
      teamData.image = filePath;
      teamData.imageUrl = getMediaUrl(filePath);
    } else if (teamData.imageUrl && /^https?:\/\//.test(teamData.imageUrl)) {
      teamData.image = teamData.imageUrl;
    } else if (!teamData.imageUrl) {
      teamData.image = '';
      teamData.imageUrl = '';
    }
    const team = await Team.create(teamData);
    res.json({ success: true, team });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', uploadTeam.single('image'), async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team member not found' });
    const teamData = JSON.parse(req.body.team);
    if (req.file) {
      const uploadedUrl = await uploadToGlobalStorage(req.file.path, { folder: 'enimegebi/team' });
      const fallbackPath = `/uploads/team/${req.file.filename}`;
      const filePath = uploadedUrl || fallbackPath;
      teamData.image = filePath;
      teamData.imageUrl = getMediaUrl(filePath);
    } else if (teamData.imageUrl && /^https?:\/\//.test(teamData.imageUrl)) {
      teamData.image = teamData.imageUrl;
    }
    Object.assign(team, teamData);
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
