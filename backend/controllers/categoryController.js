const Category = require('../models/Category');
const Product = require('../models/Product');

// Get all categories (public)
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ active: true }).sort({ order: 1 });
    
    // Get product count for each category
    const categoriesWithCount = await Promise.all(categories.map(async (category) => {
      const count = await Product.countDocuments({ category: category.name, status: 'active' });
      return {
        ...category._doc,
        productCount: count
      };
    }));
    
    res.json({ success: true, categories: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all categories for admin
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ order: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single category
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    let categoryData = req.body;
    
    if (req.file) {
      categoryData.image = `/uploads/categories/${req.file.filename}`;
    }
    
    const category = await Category.create(categoryData);
    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    let categoryData = req.body;
    
    if (req.file) {
      categoryData.image = `/uploads/categories/${req.file.filename}`;
    }
    
    Object.assign(category, categoryData);
    await category.save();
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
