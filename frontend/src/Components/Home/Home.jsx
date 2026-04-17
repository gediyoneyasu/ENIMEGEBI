import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';  // IMPORT THE CONTEXT
import { Link } from 'react-router-dom';
import './Home.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import images
import hero1 from '../../assets/hero1.png';
import hero2 from '../../assets/hero2.png';
import hero3 from '../../assets/hero3.png';

function Home() {
  const { language } = useLanguage();  // USE CONTEXT - NOT local state

  const translations = {
    en: {
      welcome: 'Welcome to Enimegebi',
      title1: 'Fresh from Farm',
      title2: 'To Your Table',
      subtitle: '100% Organic & Local Products',
      shopNow: 'Shop Now',
      callNow: 'Call Now',
      phone: '+251 96 411 3416',
      featuresTitle: 'Why Choose Enimegebi?',
      features: [
        { icon: 'ri-farm-line', title: 'Direct from Farmers', desc: 'No middlemen, better prices' },
        { icon: 'ri-leaf-line', title: '100% Organic', desc: 'Fresh and healthy products' },
        { icon: 'ri-truck-line', title: 'Fast Delivery', desc: 'Free delivery on orders over 500 ETB' },
        { icon: 'ri-secure-payment-line', title: 'Secure Payment', desc: 'Safe and easy checkout' }
      ],
      categoriesTitle: 'Shop by Category',
      categories: [
        { name: 'Coffee', icon: 'ri-cup-line', color: '#6F4E37', products: 45 },
        { name: 'Dairy', icon: 'ri-drinks-line', color: '#F5F5DC', products: 32 },
        { name: 'Fruits', icon: 'ri-apple-line', color: '#FF6B6B', products: 28 },
        { name: 'Vegetables', icon: 'ri-leaf-line', color: '#4CAF50', products: 56 },
        { name: 'Honey', icon: 'ri-drop-line', color: '#FFC107', products: 18 },
        { name: 'Meat', icon: 'ri-restaurant-line', color: '#E74C3C', products: 24 }
      ],
      featuredProducts: 'Featured Products',
      viewAll: 'View All',
      addToCart: 'Add to Cart',
      testimonials: 'What Our Customers Say',
      ctaTitle: 'Fresh Products Delivered to Your Doorstep',
      ctaSubtitle: 'Join thousands of happy customers',
      getStarted: 'Get Started'
    },
    am: {
      welcome: 'እንኳን ወደ እንመገቢ በደህና መጡ',
      title1: 'ከእርሻ የተገኘ',
      title2: 'ወደ ጠረጴዛዎ',
      subtitle: '100% ኦርጋኒክ እና የአገር ውስጥ ምርቶች',
      shopNow: 'አሁን ይግዙ',
      callNow: 'አሁን ይደውሉ',
      phone: '+251 96 411 3416',
      featuresTitle: 'ለምን እንመገቢን ይመርጣሉ?',
      features: [
        { icon: 'ri-farm-line', title: 'ከአርሶ አደር በቀጥታ', desc: 'ምንም ደላላ የለም, የተሻለ ዋጋ' },
        { icon: 'ri-leaf-line', title: '100% ኦርጋኒክ', desc: 'ትኩስ እና ጤናማ ምርቶች' },
        { icon: 'ri-truck-line', title: 'ፈጣን አቅርቦት', desc: 'ከ500 ብር በላይ ትእዛዝ ነጻ አቅርቦት' },
        { icon: 'ri-secure-payment-line', title: 'ደህንነቱ የተጠበቀ ክፍያ', desc: 'አስተማማኝ እና ቀላል ቼክአውት' }
      ],
      categoriesTitle: 'በምድብ ይግዙ',
      categories: [
        { name: 'ቡና', icon: 'ri-cup-line', color: '#6F4E37', products: 45 },
        { name: 'ወተት', icon: 'ri-drinks-line', color: '#F5F5DC', products: 32 },
        { name: 'ፍራፍሬ', icon: 'ri-apple-line', color: '#FF6B6B', products: 28 },
        { name: 'አትክልት', icon: 'ri-leaf-line', color: '#4CAF50', products: 56 },
        { name: 'ማር', icon: 'ri-drop-line', color: '#FFC107', products: 18 },
        { name: 'ሥጋ', icon: 'ri-restaurant-line', color: '#E74C3C', products: 24 }
      ],
      featuredProducts: 'ታዋቂ ምርቶች',
      viewAll: 'ሁሉንም ይመልከቱ',
      addToCart: 'ወደ ጋሪ ጨምር',
      testimonials: 'ደንበኞቻችን ምን ይላሉ',
      ctaTitle: 'ትኩስ ምርቶች ወደ በርዎ ይደርሳሉ',
      ctaSubtitle: 'በሺዎች ከሚቆጠሩ ደስተኛ ደንበኞች ጋር ይቀላቀሉ',
      getStarted: 'ይጀምሩ'
    }
  };

  const t = translations[language];

  const featuredProducts = [
    { id: 1, name: 'Organic Coffee', price: 350, image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300', rating: 4.8, seller: 'Sidama Farmers' },
    { id: 2, name: 'Fresh Avocado', price: 120, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300', rating: 4.9, seller: 'Oromia Organic' },
    { id: 3, name: 'Raw Honey', price: 250, image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=300', rating: 4.7, seller: 'Tigray Honey' },
    { id: 4, name: 'Fresh Milk', price: 80, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300', rating: 4.8, seller: 'Debre Zeit Dairy' }
  ];

  const testimonials = [
    { id: 1, name: 'Abebech Demissie', rating: 5, comment: 'Excellent quality products! The coffee is amazing.', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 2, name: 'Tekle Berhan', rating: 5, comment: 'Fast delivery and fresh fruits. Highly recommended!', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 3, name: 'Meron Assefa', rating: 4, comment: 'Great platform for local farmers. Will order again.', image: 'https://randomuser.me/api/portraits/women/3.jpg' }
  ];

  return (
    <div className="home-page">
      {/* Hero Slider Section */}
      <div className="hero-slider">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
          className="hero-swiper"
        >
          <SwiperSlide className="hero-slide slide1">
            <div className="hero-content">
              <small>{t.welcome}</small>
              <h1>{t.title1} <span>{t.title2}</span></h1>
              <p>{t.subtitle}</p>
              <div className="hero-buttons">
                <Link to="/products" className="btn-primary">{t.shopNow}</Link>
                <a href="tel:+251964113416" className="btn-secondary">{t.callNow} {t.phone}</a>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="hero-slide slide2">
            <div className="hero-content">
              <small>{t.welcome}</small>
              <h1>Support Local <span>Farmers</span></h1>
              <p>Get fresh produce directly from Ethiopian farms</p>
              <div className="hero-buttons">
                <Link to="/products" className="btn-primary">{t.shopNow}</Link>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="hero-slide slide3">
            <div className="hero-content">
              <small>{t.welcome}</small>
              <h1>Quality <span>Products</span></h1>
              <p>100% organic and authentic Ethiopian products</p>
              <div className="hero-buttons">
                <Link to="/products" className="btn-primary">{t.shopNow}</Link>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">{t.featuresTitle}</h2>
          <div className="features-grid">
            {t.features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">{t.categoriesTitle}</h2>
          <div className="categories-grid">
            {t.categories.map((category, index) => (
              <Link to={`/categories?cat=${category.name}`} key={index} className="category-card">
                <div className="category-icon" style={{ backgroundColor: category.color + '20', color: category.color }}>
                  <i className={category.icon}></i>
                </div>
                <h3>{category.name}</h3>
                <p>{category.products} products</p>
              </Link>
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
            {featuredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <span className="product-rating"><i className="ri-star-fill"></i> {product.rating}</span>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-seller">{product.seller}</p>
                  <div className="product-price">
                    <span className="price">ETB {product.price}</span>
                    <button className="add-to-cart-btn">
                      <i className="ri-shopping-cart-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">{t.testimonials}</h2>
          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-image">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={i < testimonial.rating ? 'ri-star-fill' : 'ri-star-line'}></i>
                  ))}
                </div>
                <p>"{testimonial.comment}"</p>
                <h4>{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaSubtitle}</p>
            <Link to="/products" className="cta-btn">{t.getStarted} <i className="ri-arrow-right-line"></i></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;