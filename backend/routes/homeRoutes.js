const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadSlider, uploadTestimonial } = require('../config/upload');
const {
  getSliders,
  createSlider,
  updateSlider,
  deleteSlider,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getHomeSettings,
  updateHomeSettings,
  getPublicHomeData
} = require('../controllers/homeController');

// Public routes
router.get('/public-data', getPublicHomeData);

// Protected admin routes
router.use(protect);

// Slider routes
router.get('/sliders', getSliders);
router.post('/sliders', uploadSlider.single('image'), createSlider);
router.put('/sliders/:id', uploadSlider.single('image'), updateSlider);
router.delete('/sliders/:id', deleteSlider);

// Testimonial routes
router.get('/testimonials', getTestimonials);
router.post('/testimonials', uploadTestimonial.single('image'), createTestimonial);
router.put('/testimonials/:id', uploadTestimonial.single('image'), updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// Settings routes
router.get('/settings', getHomeSettings);
router.put('/settings', updateHomeSettings);

module.exports = router;
