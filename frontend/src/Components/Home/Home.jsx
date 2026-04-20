import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../main';
import { useCart } from '../../main';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import './Home.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

function Home() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [sliders, setSliders] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/home/public-data`);
      if (response.data.success) {
        setSliders(response.data.sliders || []);
        setFeaturedProducts(response.data.featuredProducts?.slice(0, 8) || []);
        setTestimonials(response.data.testimonials || []);
        setSettings(response.data.settings || {});
        
        // Extract categories from products
        const allProducts = response.data.featuredProducts || [];
        const categoryMap = new Map();
        
        allProducts.forEach(product => {
          if (!categoryMap.has(product.category)) {
            categoryMap.set(product.category, {
              name: product.category,
              count: allProducts.filter(p => p.category === product.category).length,
              image: product.image || product.imageUrl
            });
          }
        });
        setCategories(Array.from(categoryMap.values()).slice(0, 6));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Coffee': 'ri-cup-line',
      'Grains': 'ri-seedling-line',
      'Honey': 'ri-drop-line',
      'Dairy': 'ri-drinks-line',
      'Fruits': 'ri-apple-line',
      'Vegetables': 'ri-leaf-line',
      'Spices': 'ri-fire-line',
      'Beverages': 'ri-drinks-2-line'
    };
    return icons[category] || 'ri-apps-line';
  };

  const translations = {
    en: {
      shopNow: 'Shop Now',
      callNow: 'Call Now',
      featuresTitle: 'Why Choose Enimegebi?',
      features: [
        { icon: 'ri-farm-line', title: 'Direct from Farmers', desc: 'No middlemen, better prices' },
        { icon: 'ri-leaf-line', title: '100% Organic', desc: 'Fresh and healthy products' },
        { icon: 'ri-truck-line', title: 'Fast Delivery', desc: 'Free delivery on orders over 500 ETB' },
        { icon: 'ri-secure-payment-line', title: 'Secure Payment', desc: 'Safe and easy checkout' }
      ],
      categoriesTitle: 'Shop by Category',
      viewAllCategories: 'View All Categories',
      featuredProducts: 'Featured Products',
      viewAll: 'View All Products',
      addToCart: 'Add to Cart',
      testimonials: 'What Our Customers Say',
      getStarted: 'Get Started'
    },
    am: {
      shopNow: 'አሁን ይግዙ',
      callNow: 'አሁን ይደውሉ',
      featuresTitle: 'ለምን እንመገቢን ይመርጣሉ?',
      features: [
        { icon: 'ri-farm-line', title: 'ከአርሶ አደር በቀጥታ', desc: 'ምንም ደላላ የለም, የተሻለ ዋጋ' },
        { icon: 'ri-leaf-line', title: '100% ኦርጋኒክ', desc: 'ትኩስ እና ጤናማ ምርቶች' },
        { icon: 'ri-truck-line', title: 'ፈጣን አቅርቦት', desc: 'ከ500 ብር በላይ ትእዛዝ ነጻ አቅርቦት' },
        { icon: 'ri-secure-payment-line', title: 'ደህንነቱ የተጠበቀ ክፍያ', desc: 'አስተማማኝ እና ቀላል ቼክአውት' }
      ],
      categoriesTitle: 'በምድብ ይግዙ',
      viewAllCategories: 'ሁሉንም ምድቦች ይመልከቱ',
      featuredProducts: 'ታዋቂ ምርቶች',
      viewAll: 'ሁሉንም ምርቶች ይመልከቱ',
      addToCart: 'ወደ ጋሪ ጨምር',
      testimonials: 'ደንበኞቻችን ምን ይላሉ',
      getStarted: 'ይጀምሩ'
    }
  };

  const t = translations[language];

  if (loading) return <div className="loading-spinner"><i className="ri-loader-4-line ri-spin"></i><p>Loading...</p></div>;

  return (
    <div className="home-page">
      {/* Hero Slider Section */}
      <div className="hero-slider">
        <Swiper modules={[Autoplay, Pagination, Navigation, EffectFade]} autoplay={{ delay: 4000 }} loop={true} effect="fade" pagination={{ clickable: true }} navigation={true} className="hero-swiper">
          {sliders.map((slider, index) => (
            <SwiperSlide key={slider._id || index} className="hero-slide">
              <div className="slide-bg" style={{ backgroundImage: `url(${getImageUrl(slider.image)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="hero-content">
                <small>{language === 'en' ? 'Welcome to Enimegebi' : 'እንኳን ወደ እንመገቢ በደህና መጡ'}</small>
                <h1>{language === 'en' ? slider.title : (slider.titleAm || slider.title)} <span>{language === 'en' ? 'To Your Table' : 'ወደ ጠረጴዛዎ'}</span></h1>
                <p>{language === 'en' ? slider.subtitle : (slider.subtitleAm || slider.subtitle)}</p>
                <div className="hero-buttons">
                  <Link to="/products" className="btn-primary">{t.shopNow}</Link>
                  <a href={`tel:${settings.phone || '+251964113416'}`} className="btn-secondary">{t.callNow}</a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">{t.featuresTitle}</h2>
          <div className="features-grid">
            {t.features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon"><i className={feature.icon}></i></div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
     {/* Categories Section - Flip Card Design */}
<section className="categories-section">
  <div className="container">
    <div className="section-header">
      <h2>{t.categoriesTitle}</h2>
      <Link to="/categories" className="view-all">{t.viewAllCategories} <i className="ri-arrow-right-line"></i></Link>
    </div>
    <div className="categories-grid">
      {categories.map((category, idx) => (
        <div className="category-item" key={idx}>
          {/* Front Card */}
          <div className="category-card">
            <div className="category-icon">
              <i className={getCategoryIcon(category.name)}></i>
            </div>
            <h3>{category.name}</h3>
            <p>{category.count} Products</p>
          </div>
          {/* Back Card */}
          <div className="card-back">
            <div className="back-price">{category.name}</div>
            <div className="back-content">
              <h3>{category.name}</h3>
              <p>Fresh organic {category.name.toLowerCase()} products</p>
              <div className="back-stats">
                <span><i className="ri-shopping-bag-line"></i> {category.count} Products</span>
                <span><i className="ri-user-line"></i> Local Farmers</span>
              </div>
            </div>
            <div className="explore-link">
              <Link to={`/products?category=${category.name}`}>
                Explore <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.featuredProducts}</h2>
            <Link to="/products" className="view-all">{t.viewAll} <i className="ri-arrow-right-line"></i></Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img src={getImageUrl(product.image || product.imageUrl)} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-price">ETB {product.price}</div>
                  <button onClick={() => addToCart(product)} className="add-to-cart-btn">
                    <i className="ri-shopping-cart-line"></i> {t.addToCart}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">{t.testimonials}</h2>
          <div className="testimonials-grid">
            {testimonials.slice(0, 3).map(testimonial => (
              <div key={testimonial._id} className="testimonial-card">
                <div className="testimonial-image">
                  <img src={getImageUrl(testimonial.image)} alt={testimonial.name} />
                </div>
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => <i key={i} className={i < testimonial.rating ? 'ri-star-fill' : 'ri-star-line'}></i>)}
                </div>
                <p>"{language === 'en' ? testimonial.comment : (testimonial.commentAm || testimonial.comment)}"</p>
                <h4>{language === 'en' ? testimonial.name : (testimonial.nameAm || testimonial.name)}</h4>
                <span>{language === 'en' ? testimonial.position : (testimonial.positionAm || testimonial.position)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{language === 'en' ? (settings.ctaTitle || 'Fresh Products Delivered to Your Doorstep') : (settings.ctaTitleAm || 'ትኩስ ምርቶች ወደ በርዎ ይደርሳሉ')}</h2>
            <Link to="/products" className="cta-btn">{t.getStarted} <i className="ri-arrow-right-line"></i></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
