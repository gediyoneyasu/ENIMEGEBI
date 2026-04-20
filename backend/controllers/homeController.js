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
    const categories = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const settings = await HomeSetting.findOne();
    
    // Cloudinary URLs are already full HTTPS URLs
    res.json({
      success: true,
      sliders,
      testimonials,
      featuredProducts,
      categories,
      settings
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPublicHomeData };
