const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadSlider, uploadTestimonial } = require('../config/upload');
const Slider = require('../models/Slider');
const Testimonial = require('../models/Testimonial');
const HomeSetting = require('../models/HomeSetting');
const Product = require('../models/Product');
const { uploadToGlobalStorage } = require('../utils/mediaStorage');

const API_URL = 'https://enimegebi-backend.onrender.com';

const getMediaUrl = (pathOrUrl) => {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${API_URL}${pathOrUrl}`;
};

// Get public home data
router.get('/public-data', async (req, res) => {
  try {
    let sliders = await Slider.find({ active: true }).sort({ order: 1 });
    let testimonials = await Testimonial.find({ active: true }).sort({ createdAt: -1 });
    const featuredProducts = await Product.find({ status: 'active' }).sort({ createdAt: -1 }).limit(12);
    const categories = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const settings = await HomeSetting.findOne();
    
    // Add full image URLs and preserve remote URLs
    sliders = sliders.map(s => ({
      ...s._doc,
      imageUrl: getMediaUrl(s.imageUrl || s.image)
    }));
    
    testimonials = testimonials.map(t => ({
      ...t._doc,
      imageUrl: getMediaUrl(t.imageUrl || t.image)
    }));
    
    res.json({
      success: true,
      sliders,
      testimonials,
      featuredProducts,
      categories,
      settings
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Protected admin routes
router.use(protect);

// Slider routes
router.get('/sliders', async (req, res) => {
  try {
    const sliders = await Slider.find({}).sort({ order: 1 });
    res.json({ success: true, sliders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/sliders', uploadSlider.single('image'), async (req, res) => {
  try {
    const sliderData = JSON.parse(req.body.slider);
    if (req.file) {
      const uploadedUrl = await uploadToGlobalStorage(req.file.path, { folder: 'enimegebi/sliders' });
      const fallbackPath = `/uploads/sliders/${req.file.filename}`;
      const filePath = uploadedUrl || fallbackPath;
      sliderData.image = filePath;
      sliderData.imageUrl = getMediaUrl(filePath);
    } else if (sliderData.imageUrl && /^https?:\/\//.test(sliderData.imageUrl)) {
      sliderData.image = sliderData.imageUrl;
    } else if (!sliderData.imageUrl) {
      sliderData.image = '';
      sliderData.imageUrl = '';
    }
    const slider = await Slider.create(sliderData);
    res.json({ success: true, slider });
  } catch (error) {
    console.error('Error creating slider:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/sliders/:id', uploadSlider.single('image'), async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) return res.status(404).json({ success: false, message: 'Slider not found' });
    const sliderData = JSON.parse(req.body.slider);
    if (req.file) {
      const uploadedUrl = await uploadToGlobalStorage(req.file.path, { folder: 'enimegebi/sliders' });
      const fallbackPath = `/uploads/sliders/${req.file.filename}`;
      const filePath = uploadedUrl || fallbackPath;
      sliderData.image = filePath;
      sliderData.imageUrl = getMediaUrl(filePath);
    } else if (sliderData.imageUrl && /^https?:\/\//.test(sliderData.imageUrl)) {
      sliderData.image = sliderData.imageUrl;
    }
    Object.assign(slider, sliderData);
    await slider.save();
    res.json({ success: true, slider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/sliders/:id', async (req, res) => {
  try {
    await Slider.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Slider deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Testimonial routes
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/testimonials', uploadTestimonial.single('image'), async (req, res) => {
  try {
    const testimonialData = JSON.parse(req.body.testimonial);
    if (req.file) {
      const uploadedUrl = await uploadToGlobalStorage(req.file.path, { folder: 'enimegebi/testimonials' });
      const fallbackPath = `/uploads/testimonials/${req.file.filename}`;
      const filePath = uploadedUrl || fallbackPath;
      testimonialData.image = filePath;
      testimonialData.imageUrl = getMediaUrl(filePath);
    } else if (testimonialData.imageUrl && /^https?:\/\//.test(testimonialData.imageUrl)) {
      testimonialData.image = testimonialData.imageUrl;
    } else if (!testimonialData.imageUrl) {
      testimonialData.image = '';
      testimonialData.imageUrl = '';
    }
    const testimonial = await Testimonial.create(testimonialData);
    res.json({ success: true, testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/testimonials/:id', uploadTestimonial.single('image'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    const testimonialData = JSON.parse(req.body.testimonial);
    if (req.file) {
      const uploadedUrl = await uploadToGlobalStorage(req.file.path, { folder: 'enimegebi/testimonials' });
      const fallbackPath = `/uploads/testimonials/${req.file.filename}`;
      const filePath = uploadedUrl || fallbackPath;
      testimonialData.image = filePath;
      testimonialData.imageUrl = getMediaUrl(filePath);
    } else if (testimonialData.imageUrl && /^https?:\/\//.test(testimonialData.imageUrl)) {
      testimonialData.image = testimonialData.imageUrl;
    }
    Object.assign(testimonial, testimonialData);
    await testimonial.save();
    res.json({ success: true, testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Settings routes
router.get('/settings', async (req, res) => {
  try {
    let settings = await HomeSetting.findOne();
    if (!settings) settings = await HomeSetting.create({});
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    let settings = await HomeSetting.findOne();
    if (!settings) settings = new HomeSetting();
    Object.assign(settings, req.body);
    await settings.save();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
