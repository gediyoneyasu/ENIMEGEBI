import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import './Home.css';

function Home() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [sliders, setSliders] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5001';

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/home/public-data`);
      if (response.data.success) {
        setSliders(response.data.sliders || []);
        setFeaturedProducts(response.data.featuredProducts || []);
        setAllProducts(response.data.featuredProducts || []);
        setTestimonials(response.data.testimonials || []);
        setSettings(response.data.settings || {});
        
        // Get all categories and find their images from products
        const rawCategories = response.data.categories || [];
        
        // Get products to find category images
        const products = response.data.featuredProducts || [];
        
        // Create category list with images from actual products
        const categoryList = rawCategories.map(cat => {
          // Find a product in this category to use its image
          const categoryProduct = products.find(p => p.category === cat._id);
          
          return {
            id: cat._id,
            name: cat._id,
            nameAm: getAmharicName(cat._id),
            icon: getCategoryIcon(cat._id),
            color: getCategoryColor(cat._id),
            count: cat.count,
            // Use actual product image if available, otherwise use default
            image: categoryProduct?.imageUrl || categoryProduct?.image || getCategoryImage(cat._id),
            description: `Fresh organic ${cat._id.toLowerCase()} products from Ethiopian farmers`
          };
        });
        
        // Show first 8 categories
        setCategories(categoryList.slice(0, 8));
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAmharicName = (category) => {
    const names = {
      'Coffee': 'ቡና',
      'Grains': 'እህል',
      'Honey': 'ማር',
      'Dairy': 'ወተት',
      'Fruits': 'ፍራፍሬ',
      'Vegetables': 'አትክልት',
      'Spices': 'ቅመም',
      'Beverages': 'መጠጥ'
    };
    return names[category] || category;
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

  const getCategoryColor = (category) => {
    const colors = {
      'Coffee': '#6F4E37',
      'Grains': '#D4A373',
      'Honey': '#F4A261',
      'Dairy': '#E9C46A',
      'Fruits': '#2A9D8F',
      'Vegetables': '#4CAF50',
      'Spices': '#E76F51',
      'Beverages': '#264653'
    };
    return colors[category] || '#c9a66b';
  };

  const getCategoryImage = (category) => {
    const images = {
      'Coffee': 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500',
      'Grains': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500',
      'Honey': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
      'Dairy': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500',
      'Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500',
      'Vegetables': 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500',
      'Spices': 'https://images.unsplash.com/photo-1532335693593-41c48d1ad3ab?w=500',
      'Beverages': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500'
    };
    return images[category] || '';
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (!imagePath.startsWith('/uploads')) {
      return `${API_URL}/uploads/${imagePath}`;
    }
    return `${API_URL}${imagePath}`;
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
      viewAll: 'View All',
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
      viewAll: 'ሁሉንም ይመልከቱ',
      addToCart: 'ወደ ጋሪ ጨምር',
      testimonials: 'ደንበኞቻችን ምን ይላሉ',
      getStarted: 'ይጀምሩ'
    }
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="loading-spinner">
        <i className="ri-loader-4-line ri-spin"></i>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Slider Section */}
      <div className="hero-slider">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          effect="fade"
          pagination={{ clickable: true }}
          navigation={true}
          className="hero-swiper"
        >
          {sliders.map((slider, index) => (
            <SwiperSlide key={slider._id || index} className="hero-slide">
              <div 
                className="slide-bg" 
                style={{ 
                  backgroundImage: `url(${getImageUrl(slider.image)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '100%'
                }} 
              />
              <div className="hero-content">
                <small>{language === 'en' ? 'Welcome to Enimegebi' : 'እንኳን ወደ እንመገቢ በደህና መጡ'}</small>
                <h1>{language === 'en' ? slider.title : (slider.titleAm || slider.title)} <span>{language === 'en' ? 'To Your Table' : 'ወደ ጠረጴዛዎ'}</span></h1>
                <p>{language === 'en' ? slider.subtitle : (slider.subtitleAm || slider.subtitle)}</p>
                <div className="hero-buttons">
                  <Link to="/products" className="btn-primary">{t.shopNow}</Link>
                  <a href={`tel:${settings.phone || '+251964113416'}`} className="btn-secondary">{t.callNow} {settings.phone || '+251 96 411 3416'}</a>
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

      {/* Categories Section - Flip Cards with Real Product Images */}
      <section className="categories-section-home">
        <div className="container">
          <div className="section-header-home">
            <small className="categories-subtitle-home">{t.categoriesTitle}</small>
            <h2 className="categories-main-title-home">Explore Our <span>Categories</span></h2>
            <Link to="/categories" className="view-all-categories-btn">
              {t.viewAllCategories} <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
          
          <div className="categories-cards-home">
            {categories.map((category) => (
              <div className="category-card-home" key={category.id}>
                {/* Front Card */}
                <div 
                  className="card-front-home"
                  style={{ 
                    backgroundImage: `url(${getImageUrl(category.image)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <span className="category-badge-home">{category.count} Products</span>
                  <div className="category-icon-home">
                    <i className={category.icon}></i>
                  </div>
                  <button>{category.name}</button>
                </div>

                {/* Back Card */}
                <div 
                  className="card-back-home"
                  style={{ 
                    backgroundImage: `url(${getImageUrl(category.image)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="price-home">
                    <i className={category.icon}></i>
                    <span>{category.name}</span>
                  </div>
                  
                  <div className="card-content-home">
                    <h3>{category.name}</h3>
                    <p className="amharic-name-home">{category.nameAm}</p>
                    <div className="category-stats-home">
                      <span><i className="ri-shopping-bag-line"></i> {category.count} Products</span>
                      <span><i className="ri-user-line"></i> Local Farmers</span>
                    </div>
                    <p className="category-description-home">
                      {category.description}
                    </p>
                  </div>
                  <div className="explore-now-home">
                    <Link to={`/products?category=${category.name}`}>
                      Explore {category.name}
                      <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.featuredProducts}</h2>
            <Link to="/products" className="view-all">{t.viewAll} <i className="ri-arrow-right-line"></i></Link>
          </div>
          <div className="products-grid">
            {featuredProducts.slice(0, 8).map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img src={getImageUrl(product.imageUrl || product.image)} alt={product.name} />
                  <span className="product-rating"><i className="ri-star-fill"></i> {product.rating || 4.5}</span>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-seller">{product.seller || 'Local Farmer'}</p>
                  <div className="product-price">
                    <span className="price">ETB {product.price}</span>
                    <button onClick={() => addToCart(product)} className="add-to-cart-btn">
                      <i className="ri-shopping-cart-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section-new">
        <div className="container">
          <small className="testimonials-subtitle">{t.testimonials}</small>
          <h2 className="testimonials-title">What Our <span>Customers Say</span></h2>
          
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            speed={800}
            navigation={true}
            pagination={{ clickable: true }}
            className="testimonials-swiper-new"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial._id}>
                <div className="testimonial-item-new">
                  <img 
                    src={getImageUrl(testimonial.image)} 
                    alt={testimonial.name} 
                    className="testimonial-image-new"
                  />
                  <div className="testimonial-content-new">
                    <h3>{language === 'en' ? testimonial.name : (testimonial.nameAm || testimonial.name)}</h3>
                    <p>"{language === 'en' ? testimonial.comment : (testimonial.commentAm || testimonial.comment)}"</p>
                    <div className="testimonial-stars-new">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={i < testimonial.rating ? 'ri-star-fill' : 'ri-star-line'}></i>
                      ))}
                    </div>
                    <span className="testimonial-position-new">
                      {language === 'en' ? testimonial.position : (testimonial.positionAm || testimonial.position)}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{language === 'en' ? (settings.ctaTitle || 'Fresh Products Delivered to Your Doorstep') : (settings.ctaTitleAm || 'ትኩስ ምርቶች ወደ በርዎ ይደርሳሉ')}</h2>
            <p>{language === 'en' ? (settings.ctaSubtitle || 'Join thousands of happy customers') : (settings.ctaSubtitleAm || 'በሺዎች ከሚቆጠሩ ደስተኛ ደንበኞች ጋር ይቀላቀሉ')}</p>
            <Link to="/products" className="cta-btn">{t.getStarted} <i className="ri-arrow-right-line"></i></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
