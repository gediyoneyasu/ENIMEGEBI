import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../main';
import { useCart } from '../../main';
import getImageUrl from '../../utils/imageHelper';
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
        
        // Get products and ensure images are properly formatted
        const products = response.data.featuredProducts || [];
        const productsWithImages = products.map(product => ({
          ...product,
          imageUrl: product.imageUrl || (product.image ? `${API_URL}${product.image}` : null)
        }));
        setFeaturedProducts(productsWithImages.slice(0, 8));
        
        setTestimonials(response.data.testimonials || []);
        setSettings(response.data.settings || {});
        
        const allProducts = response.data.featuredProducts || [];
        const categoryMap = new Map();
        
        allProducts.forEach(product => {
          if (!categoryMap.has(product.category)) {
            const categoryProduct = allProducts.find(p => p.category === product.category);
            categoryMap.set(product.category, {
              name: product.category,
              count: allProducts.filter(p => p.category === product.category).length,
              image: categoryProduct?.image || categoryProduct?.imageUrl,
              nameAm: getAmharicName(product.category),
              description: `Fresh organic ${product.category.toLowerCase()} products`
            });
          }
        });
        
        setCategories(Array.from(categoryMap.values()).slice(0, 8));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAmharicName = (category) => {
    const names = {
      'Coffee': 'ቡና', 'Grains': 'እህል', 'Honey': 'ማር', 'Dairy': 'ወተት',
      'Fruits': 'ፍራፍሬ', 'Vegetables': 'አትክልት', 'Spices': 'ቅመም', 'Beverages': 'መጠጥ'
    };
    return names[category] || category;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Coffee': 'ri-cup-line', 'Grains': 'ri-seedling-line', 'Honey': 'ri-drop-line',
      'Dairy': 'ri-drinks-line', 'Fruits': 'ri-apple-line', 'Vegetables': 'ri-leaf-line',
      'Spices': 'ri-fire-line', 'Beverages': 'ri-drinks-2-line'
    };
    return icons[category] || 'ri-apps-line';
  };

  const getProductImage = (product) => {
    if (product.imageUrl) return product.imageUrl;
    if (product.image) {
      if (product.image.startsWith('http')) return product.image;
      return `${API_URL}${product.image}`;
    }
    return null;
  };

  const translations = {
    en: {
      shopNow: 'Shop Now', callNow: 'Call Now',
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
      shopNow: 'አሁን ይግዙ', callNow: 'አሁን ይደውሉ',
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

      {/* Categories Section - FLIP CARD DESIGN */}
      <section className="categories-section-home">
        <div className="container">
          <div className="section-header-home">
            <h2 className="section-title">{t.categoriesTitle}</h2>
            <Link to="/categories" className="view-all-link">{t.viewAllCategories} <i className="ri-arrow-right-line"></i></Link>
          </div>
          
          <div className="categories-cards-home">
            {categories.map((category, idx) => (
              <div className="category-card-home" key={idx}>
                <div className="card-front-home" style={{ backgroundImage: `url(${getImageUrl(category.image)})` }}>
                  <span className="category-badge-home">{category.count} Products</span>
                  <div className="category-icon-home"><i className={getCategoryIcon(category.name)}></i></div>
                  <button>{category.name}</button>
                </div>
                <div className="card-back-home" style={{ backgroundImage: `url(${getImageUrl(category.image)})` }}>
                  <div className="price-home"><i className={getCategoryIcon(category.name)}></i><span>{category.name}</span></div>
                  <div className="card-content-home">
                    <h3>{category.name}</h3>
                    <p className="amharic-name-home">{category.nameAm}</p>
                    <div className="category-stats-home">
                      <span><i className="ri-shopping-bag-line"></i> {category.count} Products</span>
                      <span><i className="ri-user-line"></i> Local Farmers</span>
                    </div>
                    <p className="category-description-home">{category.description}</p>
                  </div>
                  <div className="explore-now-home">
                    <Link to={`/products?category=${category.name}`}>Explore {category.name}<i className="ri-arrow-right-line"></i></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section-home">
        <div className="container">
          <div className="section-header-home">
            <h2 className="section-title">{t.featuredProducts}</h2>
            <Link to="/products" className="view-all-link">{t.viewAll} <i className="ri-arrow-right-line"></i></Link>
          </div>
          <div className="products-grid-home">
            {featuredProducts.map(product => {
              const productImage = getProductImage(product);
              return (
                <div key={product._id} className="product-card-home">
                  <div className="product-image-home">
                    {productImage ? (
                      <img src={productImage} alt={product.name} />
                    ) : (
                      <div className="no-image-placeholder">
                        <i className="ri-image-line"></i>
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="product-info-home">
                    <h3>{language === 'en' ? product.name : (product.nameAm || product.name)}</h3>
                    <div className="product-price-home">ETB {product.price}</div>
                    <button onClick={() => addToCart(product)} className="add-to-cart-btn-home">
                      <i className="ri-shopping-cart-line"></i> {t.addToCart}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section-home">
        <div className="container">
          <h2 className="section-title">{t.testimonials}</h2>
          <div className="testimonials-grid-home">
            {testimonials.slice(0, 3).map(testimonial => (
              <div key={testimonial._id} className="testimonial-card-home">
                <div className="testimonial-image-home"><img src={getImageUrl(testimonial.image)} alt={testimonial.name} /></div>
                <div className="testimonial-rating-home">
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
      <section className="cta-section-home">
        <div className="container">
          <div className="cta-content-home">
            <h2>{language === 'en' ? (settings.ctaTitle || 'Fresh Products Delivered to Your Doorstep') : (settings.ctaTitleAm || 'ትኩስ ምርቶች ወደ በርዎ ይደርሳሉ')}</h2>
            <p>{language === 'en' ? (settings.ctaSubtitle || 'Join thousands of happy customers') : (settings.ctaSubtitleAm || 'በሺዎች ከሚቆጠሩ ደስተኛ ደንበኞች ጋር ይቀላቀሉ')}</p>
            <Link to="/products" className="cta-btn-home">{t.getStarted} <i className="ri-arrow-right-line"></i></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
