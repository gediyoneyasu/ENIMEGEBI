const Project = require('../models/Project');
const getImageUrl = require('../utils/imageHelper');
const { uploadToGlobalStorage } = require('../utils/mediaStorage');

const inferFileTypeFromUrl = (url = '') => {
  const lower = url.toLowerCase();
  if (lower.includes('.pdf')) return 'pdf';
  if (/\.(mp4|mov|avi|mkv)(\?|$)/.test(lower)) return 'video';
  return 'image';
};

// Get public projects
const getPublicProjects = async (req, res) => {
  try {
    let projects = await Project.find({ isApproved: true }).sort({ order: 1 });
    projects = projects.map(p => ({
      ...p._doc,
      imageUrl: getImageUrl(p.imageUrl || p.image),
      fileUrl: getImageUrl(p.fileUrl)
    }));
    res.json({ success: true, projects });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all projects for admin
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1 });
    const mappedProjects = projects.map(p => ({
      ...p._doc,
      imageUrl: getImageUrl(p.imageUrl || p.image),
      fileUrl: getImageUrl(p.fileUrl)
    }));
    res.json({ success: true, projects: mappedProjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    
    const hasAccess = project.purchasedBy.some(p => 
      p.user.toString() === req.user.id && p.isUnlocked === true
    );
    
    if (!hasAccess && req.user.role !== 'admin') {
      return res.json({
        success: true,
        project: {
          _id: project._id,
          title: project.title,
          titleAm: project.titleAm,
          description: project.description,
          descriptionAm: project.descriptionAm,
          image: project.image,
          imageUrl: getImageUrl(project.imageUrl || project.image),
          price: project.price,
          status: 'locked'
        }
      });
    }
    
    res.json({ 
      success: true, 
      project: {
        ...project._doc,
        imageUrl: getImageUrl(project.imageUrl || project.image),
        fileUrl: getImageUrl(project.fileUrl)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create project
const createProject = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    let projectData;
    if (req.body.project) {
      projectData = JSON.parse(req.body.project);
    } else {
      projectData = req.body;
    }
    
    if (req.file) {
      const ext = req.file.originalname.split('.').pop().toLowerCase();
      const uploadedUrl = await uploadToGlobalStorage(req.file.path, {
        folder: 'enimegebi/projects',
        resourceType: 'auto'
      });
      const fallbackPath = `/uploads/projects/${req.file.filename}`;
      const filePath = uploadedUrl || fallbackPath;
      
      if (ext === 'pdf') {
        projectData.fileType = 'pdf';
        projectData.fileUrl = filePath;
      } else if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) {
        projectData.fileType = 'video';
        projectData.fileUrl = filePath;
      } else {
        projectData.fileType = 'image';
        projectData.image = filePath;
        projectData.imageUrl = getImageUrl(filePath);
      }
    } else if (projectData.fileUrl && projectData.fileUrl.startsWith('http')) {
      projectData.fileType = inferFileTypeFromUrl(projectData.fileUrl);
      if (projectData.fileType === 'image') {
        projectData.image = projectData.fileUrl;
        projectData.imageUrl = projectData.fileUrl;
      }
    } else if (projectData.imageUrl && projectData.imageUrl.startsWith('http')) {
      projectData.image = projectData.imageUrl;
    }
    
    const project = await Project.create(projectData);
    console.log('Project created:', project);
    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    
    let projectData;
    if (req.body.project) {
      projectData = JSON.parse(req.body.project);
    } else {
      projectData = req.body;
    }
    
    if (req.file) {
      const ext = req.file.originalname.split('.').pop().toLowerCase();
      const uploadedUrl = await uploadToGlobalStorage(req.file.path, {
        folder: 'enimegebi/projects',
        resourceType: 'auto'
      });
      const fallbackPath = `/uploads/projects/${req.file.filename}`;
      const filePath = uploadedUrl || fallbackPath;
      
      if (ext === 'pdf') {
        projectData.fileType = 'pdf';
        projectData.fileUrl = filePath;
      } else if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) {
        projectData.fileType = 'video';
        projectData.fileUrl = filePath;
      } else {
        projectData.fileType = 'image';
        projectData.image = filePath;
        projectData.imageUrl = getImageUrl(filePath);
      }
    } else if (projectData.fileUrl && projectData.fileUrl.startsWith('http')) {
      projectData.fileType = inferFileTypeFromUrl(projectData.fileUrl);
      if (projectData.fileType === 'image') {
        projectData.image = projectData.fileUrl;
        projectData.imageUrl = projectData.fileUrl;
      }
    } else if (projectData.imageUrl && projectData.imageUrl.startsWith('http')) {
      projectData.image = projectData.imageUrl;
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

// Approve project
const approveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    project.isApproved = true;
    await project.save();
    res.json({ success: true, message: 'Project approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Purchase project
const purchaseProject = async (req, res) => {
  try {
    const { projectId, amount } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    
    const alreadyPurchased = project.purchasedBy.some(p => p.user.toString() === req.user.id);
    if (alreadyPurchased) {
      return res.json({ success: true, message: 'Already purchased, waiting for approval' });
    }
    
    project.purchasedBy.push({
      user: req.user.id,
      amount: amount,
      purchasedAt: new Date(),
      isUnlocked: false
    });
    await project.save();
    res.json({ success: true, message: 'Purchase request sent, waiting for admin approval' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve purchase
const approvePurchase = async (req, res) => {
  try {
    const { projectId, userId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    
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
};

// Get user's purchased projects
const getUserProjects = async (req, res) => {
  try {
    let projects = await Project.find({
      'purchasedBy.user': req.user.id,
      'purchasedBy.isUnlocked': true
    });
    projects = projects.map(p => ({
      ...p._doc,
      imageUrl: getImageUrl(p.imageUrl || p.image),
      fileUrl: getImageUrl(p.fileUrl)
    }));
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPublicProjects,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  approveProject,
  purchaseProject,
  approvePurchase,
  getUserProjects
};
