const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadProduct } = require('../config/upload');
const Project = require('../models/Project');

// Get public projects
router.get('/public', async (req, res) => {
  try {
    const projects = await Project.find({ isApproved: true, status: 'unlocked' }).sort({ order: 1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all projects (admin)
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create project
router.post('/', protect, uploadProduct.single('image'), async (req, res) => {
  try {
    let projectData = req.body;
    if (req.file) {
      projectData.image = `/uploads/projects/${req.file.filename}`;
    }
    const project = await Project.create(projectData);
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update project
router.put('/:id', protect, uploadProduct.single('image'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    let projectData = req.body;
    if (req.file) {
      projectData.image = `/uploads/projects/${req.file.filename}`;
    }
    Object.assign(project, projectData);
    await project.save();
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete project
router.delete('/:id', protect, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
