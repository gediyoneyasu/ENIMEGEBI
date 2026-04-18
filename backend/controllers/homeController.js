const Slider = require('../models/Slider');
const Testimonial = require('../models/Testimonial');
const HomeSetting = require('../models/HomeSetting');
const Product = require('../models/Product');

// Get public home data
const getPublicHomeData = async (req, res) => {
  try {
    const sliders = await Slider.find({ active: true }).sort({ order: 1 });
    const testimonials = await Testimonial.find({ active: true }).sort({ createdAt: -1 });
    const featuredProducts = await Product.find({ status: 'active' }).sort({ createdAt: -1 }).limit(12);
    
    // Add full image URLs to products
    const productsWithUrls = featuredProducts.map(product => ({
      ...product._doc,
      imageUrl: product.image ? `http://localhost:5001${product.image}` : null
    }));
    
    // Get categories with product counts
    const categories = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const settings = await HomeSetting.findOne();
    
    // Fix slider image paths
    const fixedSliders = sliders.map(s => ({
      ...s._doc,
      image: s.image ? (s.image.startsWith('/uploads') ? s.image : `/uploads/sliders/${s.image.split('/').pop()}`) : null
    }));
    
    const fixedTestimonials = testimonials.map(t => ({
      ...t._doc,
      image: t.image ? (t.image.startsWith('/uploads') ? t.image : `/uploads/testimonials/${t.image.split('/').pop()}`) : null
    }));
    
    res.json({
      success: true,
      sliders: fixedSliders,
      testimonials: fixedTestimonials,
      featuredProducts: productsWithUrls,
      categories,
      settings
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPublicHomeData
};

// Get all sliders (admin)
const getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find({}).sort({ order: 1 });
    res.json({ success: true, sliders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create slider
const createSlider = async (req, res) => {
  try {
    const sliderData = JSON.parse(req.body.slider);
    if (req.file) {
      sliderData.image = `/uploads/sliders/${req.file.filename}`;
    }
    const slider = await Slider.create(sliderData);
    res.json({ success: true, slider });
  } catch (error) {
    console.error('Error creating slider:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update slider
const updateSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res.status(404).json({ success: false, message: 'Slider not found' });
    }
    const sliderData = JSON.parse(req.body.slider);
    if (req.file) {
      sliderData.image = `/uploads/sliders/${req.file.filename}`;
    }
    Object.assign(slider, sliderData);
    await slider.save();
    res.json({ success: true, slider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete slider
const deleteSlider = async (req, res) => {
  try {
    await Slider.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Slider deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all testimonials (admin)
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create testimonial
const createTestimonial = async (req, res) => {
  try {
    const testimonialData = JSON.parse(req.body.testimonial);
    if (req.file) {
      testimonialData.image = `/uploads/testimonials/${req.file.filename}`;
    }
    const testimonial = await Testimonial.create(testimonialData);
    res.json({ success: true, testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update testimonial
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    const testimonialData = JSON.parse(req.body.testimonial);
    if (req.file) {
      testimonialData.image = `/uploads/testimonials/${req.file.filename}`;
    }
    Object.assign(testimonial, testimonialData);
    await testimonial.save();
    res.json({ success: true, testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete testimonial
const deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get home settings
const getHomeSettings = async (req, res) => {
  try {
    let settings = await HomeSetting.findOne();
    if (!settings) {
      settings = await HomeSetting.create({});
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update home settings
const updateHomeSettings = async (req, res) => {
  try {
    let settings = await HomeSetting.findOne();
    if (!settings) {
      settings = new HomeSetting();
    }
    Object.assign(settings, req.body);
    await settings.save();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPublicHomeData,
  getSliders,
  createSlider,
  updateSlider,
  deleteSlider,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getHomeSettings,
  updateHomeSettings
};
