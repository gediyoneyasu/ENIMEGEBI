import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../main';
import { useCart } from '../../main';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Home.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function Home() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  const staticBrandData = {
    companyName: 'E-MARKATO',
    tagline: 'SHOP SMART SHOP LOCAL',
    description: 'ETHIOPIAN ONLINE MARKETPLACE',
    services: 'BUY • SELL • DELIVER',
    tagline2: 'EVERYTHING YOU NEED, ONE MARKETPLACE.',
    categoriesList: [
      { name: 'ELECTRONICS', icon: 'ri-smartphone-line', color: '#FF6B00' },
      { name: 'FASHION', icon: 'ri-shirt-line', color: '#E74C3C' },
      { name: 'HOME & KITCHEN', icon: 'ri-home-smile-line', color: '#2ECC71' },
      { name: 'BOOKS', icon: 'ri-book-open-line', color: '#9B59B6' },
      { name: 'GROCERIES', icon: 'ri-shopping-basket-line', color: '#3498DB' },
      { name: 'AGRICULTURAL', icon: 'ri-seedling-line', color: '#27AE60' },
      { name: 'BUSINESS', icon: 'ri-briefcase-line', color: '#F39C12' },
      { name: 'DELIVERY', icon: 'ri-truck-line', color: '#1ABC9C' }
    ],
    banners: [
      { id: 1, image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg', title: 'Super Sale!', subtitle: 'Up to 70% Off on Electronics', btnText: 'Shop Now' },
      { id: 2, image: 'https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg', title: 'Fashion Week', subtitle: 'Get 50% Off on Latest Collection', btnText: 'Explore' },
      { id: 3, image: 'https://images.pexels.com/photos/4397842/pexels-photo-4397842.jpeg', title: 'Free Delivery', subtitle: 'On orders over ETB 1000', btnText: 'Order Now' }
    ],
    quickLinks: [
      { icon: 'ri-flashlight-line', label: 'Flash Deals', color: '#FF6B00' },
      { icon: 'ri-truck-line', label: 'Free Shipping', color: '#2ECC71' },
      { icon: 'ri-customer-service-line', label: '24/7 Support', color: '#3498DB' },
      { icon: 'ri-shield-check-line', label: 'Secure Payment', color: '#9B59B6' }
    ],
    trustText: 'YOUR TRUSTED MARKETPLACE IN ETHIOPIA'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const productsRes = await axios.get(`${API_URL}/api/admin/public-products`);
      let allProducts = [];
      if (Array.isArray(productsRes.data)) {
        allProducts = productsRes.data;
      } else if (productsRes.data && productsRes.data.products) {
        allProducts = productsRes.data.products;
      }
      
      const activeProducts = allProducts.filter(p => p && (p.status === 'active' || !p.status));
      
      setFeaturedProducts(activeProducts.slice(0, 12));
      setFlashDeals(activeProducts.slice(0, 6));
      setBestSellers(activeProducts.slice(3, 9));

      const categoryMap = new Map();
      activeProducts.forEach((product) => {
        if (product && product?.category) {
          if (!categoryMap.has(product.category)) {
            categoryMap.set(product.category, {
              name: product.category,
              count: 1,
            });
          } else {
            const existing = categoryMap.get(product.category);
            existing.count += 1;
          }
        }
      });
      setCategories(Array.from(categoryMap.values()).slice(0, 8));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
    return `${API_URL}/uploads/${imagePath}`;
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image) return product.image;
    if (product.imageUrl) return product.imageUrl;
    return null;
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const renderStars = (rating = 4) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i key={i} className={i <= rating ? 'ri-star-fill' : 'ri-star-line'}></i>
      );
    }
    return stars;
  };

  const translations = {
    en: {
      flashDeals: 'Flash Deals',
      endsIn: 'Ends in:',
      viewAll: 'View All',
      shopByCategory: 'Shop by Category',
      bestSellers: 'Best Sellers',
      featuredProducts: 'Featured Products',
      megaSale: 'Mega Sale!',
      upToOff: 'Up to 70% OFF',
      limitedTime: 'Limited time offer',
      shopNow: 'Shop Now',
      addToCart: 'Add to Cart',
      freeShipping: 'Free Shipping',
      sold: 'sold'
    },
    am: {
      flashDeals: 'ፍላሽ ሽያጮች',
      endsIn: 'የሚያበቃው በ:',
      viewAll: 'ሁሉንም ይመልከቱ',
      shopByCategory: 'በምድብ ይግዙ',
      bestSellers: 'በሽያጭ የተሻሉ',
      featuredProducts: 'ታዋቂ ምርቶች',
      megaSale: 'ሜጋ ሽያጭ!',
      upToOff: 'እስከ 70% ቅናሽ',
      limitedTime: 'የተወሰነ ጊዜ ቅናሽ',
      shopNow: 'አሁን ይግዙ',
      addToCart: 'ወደ ጋሪ ጨምር',
      freeShipping: 'ነጻ አቅርቦት',
      sold: 'ተሽጧል'
    }
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="ae-home-loading">
        <div className="ae-loading-spinner"></div>
        <p>Loading amazing deals...</p>
      </div>
    );
  }

  return (
    <div className="ae-home-page">
      <div className="ae-home-container">
        <div className="ae-banner-section">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            pagination={{ clickable: true }}
            navigation={true}
            className="ae-banner-swiper"
          >
            {staticBrandData.banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="ae-banner-slide">
                  <img src={banner.image} alt={banner.title} className="ae-banner-img" />
                  <div className="ae-banner-content">
                    <h2>{banner.title}</h2>
                    <p>{banner.subtitle}</p>
                    <Link to="/products" className="ae-banner-btn">{banner.btnText} →</Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="ae-quick-links">
          {staticBrandData.quickLinks.map((link, idx) => (
            <Link to="/products" key={idx} className="ae-quick-link">
              <div className="ae-quick-icon" style={{ backgroundColor: link.color + '15' }}>
                <i className={link.icon} style={{ color: link.color }}></i>
              </div>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {flashDeals.length > 0 && (
          <div className="ae-section">
            <div className="ae-section-header">
              <div className="ae-section-title">
                <i className="ri-flashlight-line ae-flash-icon"></i>
                <h2>{t.flashDeals}</h2>
              </div>
              <div className="ae-timer">
                <span className="ae-timer-label">{t.endsIn}</span>
                <div className="ae-timer-box">
                  <span className="ae-timer-num">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="ae-timer-unit">h</span>
                </div>
                <span className="ae-timer-sep">:</span>
                <div className="ae-timer-box">
                  <span className="ae-timer-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="ae-timer-unit">m</span>
                </div>
                <span className="ae-timer-sep">:</span>
                <div className="ae-timer-box">
                  <span className="ae-timer-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="ae-timer-unit">s</span>
                </div>
              </div>
              <Link to="/products" className="ae-view-all">{t.viewAll} →</Link>
            </div>

            <div className="ae-products-grid ae-flash-grid">
              {flashDeals.map(product => {
                const discount = Math.floor(Math.random() * 30) + 10;
                const originalPrice = Math.floor(product.price * (1 + discount / 100));
                return (
                  <Link to={`/product/${product._id}`} key={product._id} className="ae-product-card-link">
                    <div className="ae-product-card">
                      <div className="ae-product-img">
                        <img 
                          src={getImageUrl(getProductImage(product))} 
                          alt={product.name}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=Product'; }}
                          loading="lazy"
                        />
                        <span className="ae-discount-badge">-{discount}%</span>
                      </div>
                      <div className="ae-product-info">
                        <h3 className="ae-product-title">{product.name}</h3>
                        <div className="ae-price">
                          <span className="ae-current">ETB {product.price}</span>
                          <span className="ae-old">ETB {originalPrice}</span>
                        </div>
                        <div className="ae-progress">
                          <div className="ae-progress-bar">
                            <div className="ae-progress-fill" style={{ width: '65%' }}></div>
                          </div>
                          <span className="ae-sold">🔥 {Math.floor(Math.random() * 1000)}+ {t.sold}</span>
                        </div>
                        <button onClick={(e) => handleAddToCart(product, e)} className="ae-add-btn">
                          <i className="ri-shopping-cart-line"></i> {t.addToCart}
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="ae-section">
          <div className="ae-section-header">
            <h2 className="ae-section-title">{t.shopByCategory}</h2>
            <Link to="/categories" className="ae-view-all">{t.viewAll} →</Link>
          </div>
          <div className="ae-categories-grid">
            {staticBrandData.categoriesList.map((cat, idx) => (
              <Link to={`/products?category=${cat.name}`} key={idx} className="ae-category-card">
                <div className="ae-category-icon" style={{ backgroundColor: cat.color + '15' }}>
                  <i className={cat.icon} style={{ color: cat.color }}></i>
                </div>
                <span className="ae-category-name">{cat.name}</span>
                <span className="ae-category-count">{Math.floor(Math.random() * 500)}+ items</span>
              </Link>
            ))}
          </div>
        </div>

        {bestSellers.length > 0 && (
          <div className="ae-section">
            <div className="ae-section-header">
              <h2 className="ae-section-title">🔥 {t.bestSellers}</h2>
              <Link to="/products" className="ae-view-all">{t.viewAll} →</Link>
            </div>
            <div className="ae-products-grid">
              {bestSellers.map(product => (
                <Link to={`/product/${product._id}`} key={product._id} className="ae-product-card-link">
                  <div className="ae-product-card">
                    <div className="ae-product-img">
                      <img 
                        src={getImageUrl(getProductImage(product))} 
                        alt={product.name}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=Product'; }}
                        loading="lazy"
                      />
                    </div>
                    <div className="ae-product-info">
                      <h3 className="ae-product-title">{product.name}</h3>
                      <div className="ae-rating">
                        <div className="ae-stars">{renderStars()}</div>
                        <span className="ae-rating-count">({Math.floor(Math.random() * 500)})</span>
                      </div>
                      <div className="ae-price">
                        <span className="ae-current">ETB {product.price}</span>
                      </div>
                      <div className="ae-shipping">
                        <i className="ri-truck-line"></i> {t.freeShipping}
                      </div>
                      <button onClick={(e) => handleAddToCart(product, e)} className="ae-add-btn">
                        <i className="ri-shopping-cart-line"></i> {t.addToCart}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link to="/products" className="ae-mega-banner">
          <div className="ae-mega-content">
            <h3>🎉 {t.megaSale}</h3>
            <p>{t.upToOff}</p>
            <span>{t.limitedTime}</span>
            <div className="ae-mega-btn">{t.shopNow} →</div>
          </div>
          <div className="ae-mega-emoji">🛍️</div>
        </Link>

        {featuredProducts.length > 0 && (
          <div className="ae-section">
            <div className="ae-section-header">
              <h2 className="ae-section-title">✨ {t.featuredProducts}</h2>
              <Link to="/products" className="ae-view-all">{t.viewAll} →</Link>
            </div>
            <div className="ae-products-grid">
              {featuredProducts.slice(0, 8).map(product => (
                <Link to={`/product/${product._id}`} key={product._id} className="ae-product-card-link">
                  <div className="ae-product-card">
                    <div className="ae-product-img">
                      <img 
                        src={getImageUrl(getProductImage(product))} 
                        alt={product.name}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=Product'; }}
                        loading="lazy"
                      />
                    </div>
                    <div className="ae-product-info">
                      <h3 className="ae-product-title">{product.name}</h3>
                      <div className="ae-price">
                        <span className="ae-current">ETB {product.price}</span>
                      </div>
                      <button onClick={(e) => handleAddToCart(product, e)} className="ae-add-btn">
                        <i className="ri-shopping-cart-line"></i> {t.addToCart}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="ae-trust-badge">
          <i className="ri-shield-check-line"></i>
          {staticBrandData.trustText}
        </div>
      </div>
    </div>
  );
}

export default Home;
