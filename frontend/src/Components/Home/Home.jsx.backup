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

const API_URL = 'http://localhost:5001';

function Home() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);

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
      setLoading(true);
      console.log('📦 Fetching products from:', `${API_URL}/api/admin/public-products`);
      
      const productsRes = await axios.get(`${API_URL}/api/admin/public-products`);
      console.log('📡 API Response:', productsRes.data);
      
      let allProducts = [];
      if (Array.isArray(productsRes.data)) {
        allProducts = productsRes.data;
      } else if (productsRes.data && productsRes.data.products) {
        allProducts = productsRes.data.products;
      } else if (productsRes.data && productsRes.data.data) {
        allProducts = productsRes.data.data;
      }
      
      console.log('📊 Total products found:', allProducts.length);
      
      const activeProducts = allProducts.filter(p => p && (p.status === 'active' || !p.status));
      console.log('✅ Active products:', activeProducts.length);
      
      if (activeProducts.length === 0) {
        console.warn('⚠️ No products found! Check if products exist in database.');
      } else {
        console.log('📦 First product sample:', activeProducts[0]);
      }
      
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
      console.error('❌ Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x300?text=Product';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
    return `${API_URL}/uploads/${imagePath}`;
  };

  const getProductImages = (product) => {
    const images = [getImageUrl(product.image || product.imageUrl)];
    if (product.images && product.images.length) {
      product.images.forEach(img => images.push(getImageUrl(img)));
    }
    while (images.length < 3) {
      images.push('https://via.placeholder.com/600x600?text=Product+Image');
    }
    return images.slice(0, 8);
  };

  const handleMouseEnter = (productId) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoveredProductId(productId);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredProductId(null);
    }, 200);
    setHoverTimeout(timeout);
  };

  const openPreview = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewProduct(product);
    setCurrentImageIndex(0);
    const similar = featuredProducts.filter(p => p.category === product.category && p._id !== product._id).slice(0, 6);
    setSimilarProducts(similar);
    setShowPreviewModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closePreview = () => {
    setShowPreviewModal(false);
    setPreviewProduct(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (previewProduct) {
      const images = getProductImages(previewProduct);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (previewProduct) {
      const images = getProductImages(previewProduct);
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    const toast = document.createElement('div');
    toast.innerHTML = `✅ Added ${product.name} to cart!`;
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#032B67;color:white;padding:12px 24px;border-radius:8px;z-index:9999;animation:fadeInOut 2s';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const renderStars = (rating = 4.5) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="ae-stars">
        {[...Array(5)].map((_, i) => (
          <i key={i} className={
            i < fullStars ? 'ri-star-fill' : 
            (i === fullStars && hasHalfStar ? 'ri-star-half-fill' : 'ri-star-line')
          }></i>
        ))}
      </div>
    );
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
      sold: 'sold',
      seePreview: 'Quick View',
      similarItems: 'Similar Items',
      description: 'Description'
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
      sold: 'ተሽጧል',
      seePreview: 'ፈጣን እይታ',
      similarItems: 'ተመሳሳይ ምርቶች',
      description: 'መግለጫ'
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

  // Show message if no products
  const hasProducts = flashDeals.length > 0 || bestSellers.length > 0 || featuredProducts.length > 0;

  return (
    <div className="ae-home-page">
      <div className="ae-home-container">
        {/* Banner Carousel */}
        <div className="ae-banner-section">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            effect="fade"
            pagination={{ clickable: true }}
            navigation={true}
            className="ae-banner-swiper"
          >
            {staticBrandData.banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="ae-banner-slide">
                  <img src={banner.image} alt={banner.title} className="ae-banner-img" />
                  <div className="ae-banner-content">
                    <span className="ae-banner-badge">{staticBrandData.tagline}</span>
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
              <div className="ae-quick-icon" style={{ backgroundColor: link.color + '15' }}>
                <i className={link.icon} style={{ color: link.color }}></i>
              </div>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* No Products Message */}
        {!hasProducts && (
          <div className="ae-no-products">
            <i className="ri-shopping-bag-line"></i>
            <h3>No Products Found</h3>
            <p>Please add products from the admin panel</p>
            <Link to="/admin-login" className="ae-admin-link">Go to Admin Panel →</Link>
          </div>
        )}

        {/* Flash Deals Section */}
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
                const soldCount = Math.floor(Math.random() * 1000) + 10;
                const isHovered = hoveredProductId === product._id;
                const productImages = getProductImages(product);
                
                return (
                  <div 
                    key={product._id} 
                    className="ae-product-card"
                    onMouseEnter={() => handleMouseEnter(product._id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to={`/product/${product._id}`} className="ae-product-link">
                      <div className="ae-product-img">
                        <img 
                          src={productImages[0]} 
                          alt={product.name}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=Product'; }}
                        />
                        {productImages.length > 1 && (
                          <div className="ae-multi-badge">
                            <i className="ri-image-line"></i> {productImages.length}
                          </div>
                        )}
                        <span className="ae-discount-badge">-{discount}%</span>
                      </div>
                      <div className="ae-product-info">
                        <h3 className="ae-product-title">{product.name}</h3>
                        <div className="ae-price">
                          <span className="ae-current">ETB {product.price.toLocaleString()}</span>
                          <span className="ae-old">ETB {originalPrice.toLocaleString()}</span>
                        </div>
                        <div className="ae-rating">
                          {renderStars(4.5)}
                          <span className="ae-rating-count">({soldCount}+ {t.sold})</span>
                        </div>
                        <div className="ae-progress">
                          <div className="ae-progress-bar">
                            <div className="ae-progress-fill" style={{ width: '65%' }}></div>
                          </div>
                          <span className="ae-sold">🔥 {Math.floor(Math.random() * 1000)}+ {t.sold}</span>
                        </div>
                      </div>
                    </Link>
                    
                    <button className="ae-add-to-cart" onClick={(e) => handleAddToCart(product, e)}>
                      <i className="ri-shopping-cart-line"></i> {t.addToCart}
                    </button>
                    
                    {isHovered && (
                      <div className="ae-hover-overlay">
                        <button className="ae-see-preview-btn" onClick={(e) => openPreview(product, e)}>
                          <i className="ri-eye-line"></i> {t.seePreview}
                        </button>
                        <button className="ae-similar-btn" onClick={(e) => {
                          e.preventDefault();
                          const similar = featuredProducts.filter(p => p.category === product.category && p._id !== product._id).slice(0, 3);
                          setSimilarProducts(similar);
                          setPreviewProduct(product);
                          setShowPreviewModal(true);
                        }}>
                          <i className="ri-list-check-line"></i> {t.similarItems}
                        </button>
                      </div>
                    )}
                  </div>
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
                <div className="ae-category-icon" style={{ backgroundColor: cat.color + '15' }}>
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
              {bestSellers.map(product => {
                const soldCount = Math.floor(Math.random() * 1000) + 10;
                const isHovered = hoveredProductId === product._id;
                const productImages = getProductImages(product);
                
                return (
                  <div 
                    key={product._id} 
                    className="ae-product-card"
                    onMouseEnter={() => handleMouseEnter(product._id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to={`/product/${product._id}`} className="ae-product-link">
                      <div className="ae-product-img">
                        <img 
                          src={productImages[0]} 
                          alt={product.name}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=Product'; }}
                        />
                      </div>
                      <div className="ae-product-info">
                        <h3 className="ae-product-title">{product.name}</h3>
                        <div className="ae-rating">
                          {renderStars(4.5)}
                          <span className="ae-rating-count">({soldCount}+ {t.sold})</span>
                        </div>
                        <div className="ae-price">
                          <span className="ae-current">ETB {product.price.toLocaleString()}</span>
                        </div>
                        <div className="ae-shipping">
                          <i className="ri-truck-line"></i> {t.freeShipping}
                        </div>
                      </div>
                    </Link>
                    
                    <button className="ae-add-to-cart" onClick={(e) => handleAddToCart(product, e)}>
                      <i className="ri-shopping-cart-line"></i> {t.addToCart}
                    </button>
                    
                    {isHovered && (
                      <div className="ae-hover-overlay">
                        <button className="ae-see-preview-btn" onClick={(e) => openPreview(product, e)}>
                          <i className="ri-eye-line"></i> {t.seePreview}
                        </button>
                        <button className="ae-similar-btn" onClick={(e) => {
                          e.preventDefault();
                          const similar = featuredProducts.filter(p => p.category === product.category && p._id !== product._id).slice(0, 3);
                          setSimilarProducts(similar);
                          setPreviewProduct(product);
                          setShowPreviewModal(true);
                        }}>
                          <i className="ri-list-check-line"></i> {t.similarItems}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
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
              {featuredProducts.slice(0, 8).map(product => {
                const isHovered = hoveredProductId === product._id;
                const productImages = getProductImages(product);
                
                return (
                  <div 
                    key={product._id} 
                    className="ae-product-card"
                    onMouseEnter={() => handleMouseEnter(product._id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to={`/product/${product._id}`} className="ae-product-link">
                      <div className="ae-product-img">
                        <img 
                          src={productImages[0]} 
                          alt={product.name}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=Product'; }}
                        />
                      </div>
                      <div className="ae-product-info">
                        <h3 className="ae-product-title">{product.name}</h3>
                        <div className="ae-price">
                          <span className="ae-current">ETB {product.price.toLocaleString()}</span>
                        </div>
                        <div className="ae-rating">
                          {renderStars(4.5)}
                          <span className="ae-rating-count">({Math.floor(Math.random() * 500)}+ {t.sold})</span>
                        </div>
                      </div>
                    </Link>
                    
                    <button className="ae-add-to-cart" onClick={(e) => handleAddToCart(product, e)}>
                      <i className="ri-shopping-cart-line"></i> {t.addToCart}
                    </button>
                    
                    {isHovered && (
                      <div className="ae-hover-overlay">
                        <button className="ae-see-preview-btn" onClick={(e) => openPreview(product, e)}>
                          <i className="ri-eye-line"></i> {t.seePreview}
                        </button>
                        <button className="ae-similar-btn" onClick={(e) => {
                          e.preventDefault();
                          const similar = featuredProducts.filter(p => p.category === product.category && p._id !== product._id).slice(0, 3);
                          setSimilarProducts(similar);
                          setPreviewProduct(product);
                          setShowPreviewModal(true);
                        }}>
                          <i className="ri-list-check-line"></i> {t.similarItems}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Trust Badge */}
        <div className="ae-trust-badge">
          <i className="ri-shield-check-line"></i>
          {staticBrandData.trustText}
        </div>
      </div>

      {/* Quick Preview Modal */}
      {showPreviewModal && previewProduct && (
        <div className="ae-preview-modal" onClick={closePreview}>
          <div className="ae-preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="ae-preview-close" onClick={closePreview}>✕</button>
            
            <div className="ae-preview-body">
              <div className="ae-preview-gallery">
                <div className="ae-preview-main-image">
                  <img src={getProductImages(previewProduct)[currentImageIndex]} alt={previewProduct.name} />
                  <div className="ae-preview-counter">
                    {currentImageIndex + 1} / {getProductImages(previewProduct).length}
                  </div>
                  {getProductImages(previewProduct).length > 1 && (
                    <>
                      <button className="ae-preview-nav prev" onClick={prevImage}>‹</button>
                      <button className="ae-preview-nav next" onClick={nextImage}>›</button>
                    </>
                  )}
                </div>
                <div className="ae-preview-thumbs">
                  {getProductImages(previewProduct).map((img, idx) => (
                    <div key={idx} className={`ae-preview-thumb ${currentImageIndex === idx ? 'active' : ''}`} onClick={() => setCurrentImageIndex(idx)}>
                      <img src={img} alt={`thumb ${idx + 1}`} />
                      <span>{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="ae-preview-info">
                <h2 className="ae-preview-title">{previewProduct.name}</h2>
                <div className="ae-preview-price">
                  <span className="current">ETB {previewProduct.price.toLocaleString()}</span>
                </div>
                <div className="ae-preview-description">
                  <h4>{t.description}</h4>
                  <p>{previewProduct.description || `High quality ${previewProduct.name} with premium features.`}</p>
                </div>
                <button className="ae-preview-addcart" onClick={(e) => handleAddToCart(previewProduct, e)}>
                  <i className="ri-shopping-cart-line"></i> {t.addToCart}
                </button>
                
                {similarProducts.length > 0 && (
                  <div className="ae-preview-similar">
                    <h4>{t.similarItems}</h4>
                    <div className="ae-preview-similar-grid">
                      {similarProducts.map(similar => (
                        <div key={similar._id} className="ae-preview-similar-item" onClick={() => {
                          setPreviewProduct(similar);
                          setCurrentImageIndex(0);
                          const newSimilar = featuredProducts.filter(p => p.category === similar.category && p._id !== similar._id).slice(0, 6);
                          setSimilarProducts(newSimilar);
                        }}>
                          <img src={getImageUrl(similar.image || similar.imageUrl)} alt={similar.name} />
                          <span>{similar.name}</span>
                          <strong>ETB {similar.price}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
