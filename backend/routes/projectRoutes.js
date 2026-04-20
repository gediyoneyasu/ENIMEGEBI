const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Project = require('../models/Project');

// Get public projects
router.get('/public', async (req, res) => {
  try {
    const projects = await Project.find({ isApproved: true }).sort({ order: 1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single project
router.get('/public/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all projects (admin only)
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create project (admin only)
router.post('/', protect, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update project (admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    Object.assign(project, req.body);
    await project.save();
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete project (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Purchase project
router.post('/purchase', protect, async (req, res) => {
  try {
    const { projectId, amount } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    project.purchasedBy.push({
      user: req.user.id,
      amount: amount,
      purchasedAt: new Date(),
      isUnlocked: false
    });
    await project.save();
    
    res.json({ success: true, message: 'Purchase request sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve purchase (admin only)
router.post('/approve-purchase', protect, async (req, res) => {
  try {
    const { projectId, userId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    const purchase = project.purchasedBy.find(p => p.user.toString() === userId);
    if (purchase) {
      purchase.isUnlocked = true;
      purchase.approvedAt = new Date();
      await project.save();
    }
    
    res.json({ success: true, message: 'Purchase approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve project (admin only)
router.put('/approve/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    project.isApproved = true;
    await project.save();
    res.json({ success: true, message: 'Project approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's purchased projects
router.get('/my-projects', protect, async (req, res) => {
  try {
    const projects = await Project.find({
      'purchasedBy.user': req.user.id,
      'purchasedBy.isUnlocked': true
    });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
