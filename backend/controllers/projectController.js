const Project = require('../models/Project');
const Order = require('../models/Order');

// Get all projects (public - only show unlocked/approved)
const getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({ 
      status: 'available',
      isApproved: true 
    }).sort({ order: 1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all projects for admin
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create project
const createProject = async (req, res) => {
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
};

// Update project
const updateProject = async (req, res) => {
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
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Unlock project after payment
const unlockProject = async (req, res) => {
  try {
    const { projectId, userId, amount } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    project.paidBy.push({
      user: userId,
      amount: amount,
      paidAt: new Date()
    });
    
    // Check if enough payments received
    const totalPaid = project.paidBy.reduce((sum, p) => sum + p.amount, 0);
    if (totalPaid >= project.price) {
      project.status = 'available';
      project.isPaid = true;
    }
    
    await project.save();
    res.json({ success: true, message: 'Payment recorded', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve project (admin)
const approveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    project.isApproved = true;
    project.status = 'available';
    await project.save();
    res.json({ success: true, message: 'Project approved', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPublicProjects,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  unlockProject,
  approveProject
};
