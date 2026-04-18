const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Contact = require('../models/Contact');

// ============ USER CONTROLLERS ============
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    const totalUsers = await User.countDocuments();
    const farmers = await User.countDocuments({ role: 'farmer' });
    
    res.json({
      users,
      count: totalUsers,
      farmers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.role = req.body.role || user.role;
    
    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ PRODUCT CONTROLLERS ============
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    // Add full image URL for each product
    const productsWithUrl = products.map(product => ({
      ...product._doc,
      imageUrl: product.image ? `http://localhost:5001${product.image}` : null
    }));
    res.json(productsWithUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Product with image upload
const createProductWithImage = async (req, res) => {
  try {
    let productData;
    if (req.body.product) {
      productData = JSON.parse(req.body.product);
    } else {
      productData = req.body;
    }
    
    const imageFile = req.file;
    
    if (imageFile) {
      productData.image = `/uploads/products/${imageFile.filename}`;
      productData.imageUrl = `http://localhost:5001/uploads/products/${imageFile.filename}`;
    }
    
    const product = await Product.create(productData);
    
    // Return product with full image URL
    const productWithUrl = {
      ...product._doc,
      imageUrl: product.image ? `http://localhost:5001${product.image}` : null
    };
    
    res.status(201).json(productWithUrl);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateProductWithImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let productData;
    if (req.body.product) {
      productData = JSON.parse(req.body.product);
    } else {
      productData = req.body;
    }
    
    const imageFile = req.file;
    
    if (imageFile) {
      productData.image = `/uploads/products/${imageFile.filename}`;
      productData.imageUrl = `http://localhost:5001/uploads/products/${imageFile.filename}`;
    }
    
    Object.assign(product, productData);
    await product.save();
    
    // Return product with full image URL
    const productWithUrl = {
      ...product._doc,
      imageUrl: product.image ? `http://localhost:5001${product.image}` : null
    };
    
    res.json(productWithUrl);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
};

// Public products for frontend
const getPublicProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'active' }).sort({ createdAt: -1 });
    // Add full image URL for each product
    const productsWithUrl = products.map(product => ({
      ...product._doc,
      imageUrl: product.image ? `http://localhost:5001${product.image}` : null
    }));
    res.json(productsWithUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ ORDER CONTROLLERS ============
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({
      orders,
      count: totalOrders,
      revenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.orderStatus = req.body.status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ CONTACT CONTROLLERS ============
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    const unreadCount = await Contact.countDocuments({ status: 'unread' });
    
    res.json({
      contacts,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markContactRead = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    contact.status = 'read';
    await contact.save();
    res.json({ message: 'Contact marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ DASHBOARD CONTROLLER ============
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const unreadMessages = await Contact.countDocuments({ status: 'unread' });
    
    const revenue = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenue[0]?.total || 0,
        totalFarmers,
        pendingOrders,
        unreadMessages
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ EXPORT ALL ============
module.exports = {
  // User controllers
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  // Product controllers
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductWithImage,
  updateProductWithImage,
  getPublicProducts,
  // Order controllers
  getOrders,
  updateOrderStatus,
  // Contact controllers
  getContacts,
  createContact,
  markContactRead,
  // Dashboard
  getDashboardStats
};

// Upload product image separately
const uploadProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (req.file) {
      product.image = `/uploads/products/${req.file.filename}`;
      await product.save();
      res.json({ success: true, image: product.image });
    } else {
      res.status(400).json({ message: 'No image uploaded' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
