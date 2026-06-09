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

const API_URL = 'https://enimegebi-backend.onrender.com';

function Home() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  // AliExpress style static data
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
    fetchProducts();
  }, []);

  // FIXED: Better product fetching
  const fetchProducts = async () => {
    try {
      console.log('📦 Fetching products from backend...');
      const response = await axios.get(`${API_URL}/api/admin/public-products`);
      console.log('✅ API Response:', response.data);
      
      let products = [];
      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data.products && Array.isArray(response.data.products)) {
        products = response.data.products;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      }
      
      // Filter active products
      const activeProducts = products.filter(p => p && (p.status === 'active' || !p.status));
      console.log(`📊 Found ${activeProducts.length} products`);
      
      if (activeProducts.length === 0) {
        console.warn('⚠️ No products found! Check your backend.');
        // Show sample products for demo
        setAllProducts(getSampleProducts());
      } else {
        setAllProducts(activeProducts);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      // Show sample products if API fails
      setAllProducts(getSampleProducts());
    } finally {
      setLoading(false);
    }
  };

  // Sample products for demo if API fails
  const getSampleProducts = () => {
    return [
      { _id: '1', name: 'Smartphone X Pro', price: 8999, image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg', category: 'ELECTRONICS' },
      { _id: '2', name: 'Laptop Ultrabook', price: 45999, image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg', category: 'ELECTRONICS' },
      { _id: '3', name: 'Wireless Headphones', price: 2499, image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg', category: 'ELECTRONICS' },
      { _id: '4', name: 'Smart Watch', price: 3599, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', category: 'ELECTRONICS' },
      { _id: '5', name: 'Men\'s Fashion Shirt', price: 899, image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg', category: 'FASHION' },
      { _id: '6', name: 'Women\'s Dress', price: 1499, image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg', category: 'FASHION' },
      { _id: '7', name: 'Running Shoes', price: 1999, image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', category: 'FASHION' },
      { _id: '8', name: 'Coffee Maker', price: 3499, image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg', category: 'HOME & KITCHEN' },
      { _id: '9', name: 'Air Fryer', price: 4999, image: 'https://images.pexels.com/photos/5907619/pexels-photo-5907619.jpeg', category: 'HOME & KITCHEN' },
      { _id: '10', name: 'Organic Honey', price: 350, image: 'https://images.pexels.com/photos/6475169/pexels-photo-6475169.jpeg', category: 'GROCERIES' },
      { _id: '11', name: 'Coffee Beans', price: 450, image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg', category: 'GROCERIES' },
      { _id: '12', name: 'Programming Book', price: 899, image: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg', category: 'BOOKS' }
    ];
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
    return `${API_URL}/uploads/${imagePath}`;
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    alert(`✅ ${product.name} added to cart!`);
  };

  const renderStars = (rating = 4) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={i < rating ? 'ri-star-fill' : 'ri-star-line'}></i>
    ));
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

  // Get different product slices for different sections
  const flashDeals = allProducts.slice(0, 6);
  const bestSellers = allProducts.slice(6, 12);
  const featuredProducts = allProducts.slice(12, 20);

  return (
    <div className="ae-home-page">
      <div className="ae-home-container">
        {/* Banner Carousel */}
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

        {/* Quick Links */}
        <div className="ae-quick-links">
          {staticBrandData.quickLinks.map((link, idx) => (
            <Link to="/products" key={idx} className="ae-quick-link">
              <div className="ae-quick-icon" style={{ backgroundColor: link.color + '20' }}>
                <i className={link.icon} style={{ color: link.color }}></i>
              </div>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Flash Deals Section - AliExpress Style */}
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

            <div className="ae-products-grid">
              {flashDeals.map(product => {
                const discount = Math.floor(Math.random() * 30) + 10;
                const originalPrice = Math.floor(product.price * (1 + discount / 100));
                return (
                  <Link to={`/product/${product._id}`} key={product._id} className="ae-product-card-link">
                    <div className="ae-product-card">
                      <div className="ae-product-img">
                        <img 
                          src={getImageUrl(product.image)} 
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                          }}
                        />
                        <span className="ae-discount-badge">-{discount}%</span>
                      </div>
                      <div className="ae-product-info">
                        <h3 className="ae-product-title">{product.name}</h3>
                        <div className="ae-price">
                          <span className="ae-current">ETB {product.price.toLocaleString()}</span>
                          <span className="ae-old">ETB {originalPrice.toLocaleString()}</span>
                        </div>
                        <div className="ae-rating">
                          {renderStars()}
                          <span className="ae-rating-count">(234)</span>
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

        {/* Categories Section */}
        <div className="ae-section">
          <div className="ae-section-header">
            <h2 className="ae-section-title">{t.shopByCategory}</h2>
            <Link to="/categories" className="ae-view-all">{t.viewAll} →</Link>
          </div>
          <div className="ae-categories-grid">
            {staticBrandData.categoriesList.map((cat, idx) => (
              <Link to={`/products?category=${cat.name}`} key={idx} className="ae-category-card">
                <div className="ae-category-icon" style={{ backgroundColor: cat.color + '20' }}>
                  <i className={cat.icon} style={{ color: cat.color }}></i>
                </div>
                <span className="ae-category-name">{cat.name}</span>
                <span className="ae-category-count">{Math.floor(Math.random() * 500)}+ items</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Best Sellers Section */}
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
                        src={getImageUrl(product.image)} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                        }}
                      />
                    </div>
                    <div className="ae-product-info">
                      <h3 className="ae-product-title">{product.name}</h3>
                      <div className="ae-price">
                        <span className="ae-current">ETB {product.price.toLocaleString()}</span>
                      </div>
                      <div className="ae-rating">
                        {renderStars()}
                        <span className="ae-rating-count">(189)</span>
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

        {/* Mega Sale Banner */}
        <Link to="/products" className="ae-mega-banner">
          <div className="ae-mega-content">
            <h3>🎉 {t.megaSale}</h3>
            <p>{t.upToOff}</p>
            <span>{t.limitedTime}</span>
            <div className="ae-mega-btn">{t.shopNow} →</div>
          </div>
          <div className="ae-mega-emoji">🛍️</div>
        </Link>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <div className="ae-section">
            <div className="ae-section-header">
              <h2 className="ae-section-title">✨ {t.featuredProducts}</h2>
              <Link to="/products" className="ae-view-all">{t.viewAll} →</Link>
            </div>
            <div className="ae-products-grid">
              {featuredProducts.map(product => (
                <Link to={`/product/${product._id}`} key={product._id} className="ae-product-card-link">
                  <div className="ae-product-card">
                    <div className="ae-product-img">
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                        }}
                      />
                    </div>
                    <div className="ae-product-info">
                      <h3 className="ae-product-title">{product.name}</h3>
                      <div className="ae-price">
                        <span className="ae-current">ETB {product.price.toLocaleString()}</span>
                      </div>
                      <div className="ae-rating">
                        {renderStars()}
                        <span className="ae-rating-count">(56)</span>
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

        {/* Trust Badge */}
        <div className="ae-trust-badge">
          <i className="ri-shield-check-line"></i>
          {staticBrandData.trustText}
        </div>
      </div>
    </div>
  );
}

export default Home;
