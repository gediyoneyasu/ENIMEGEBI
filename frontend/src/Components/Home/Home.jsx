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
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [homeRes, productsRes, teamRes, projectsRes] = await Promise.all([
        axios.get(`${API_URL}/api/home/public-data`),
        axios.get(`${API_URL}/api/admin/public-products`),
        axios.get(`${API_URL}/api/team/public`),
        axios.get(`${API_URL}/api/projects/public`)
      ]);

      if (homeRes.data.success) {
        setSliders(homeRes.data.sliders || []);
        setFeaturedProducts(homeRes.data.featuredProducts?.slice(0, 8) || []);
        setTestimonials(homeRes.data.testimonials || []);
        setSettings(homeRes.data.settings || {});
      }

      const allProducts = Array.isArray(productsRes.data)
        ? productsRes.data.filter((p) => p?.status === 'active')
        : [];
      const categoryMap = new Map();
      allProducts.forEach((product) => {
        if (!product?.category) return;
        if (!categoryMap.has(product.category)) {
          categoryMap.set(product.category, {
            name: product.category,
            count: 1,
            image: product.imageUrl || product.image || ''
          });
        } else {
          const existing = categoryMap.get(product.category);
          existing.count += 1;
          if (!existing.image) {
            existing.image = product.imageUrl || product.image || '';
          }
        }
      });
      setCategories(Array.from(categoryMap.values()).slice(0, 6));

      if (teamRes.data.success) {
        setTeamMembers(teamRes.data.team || []);
      }

      if (projectsRes.data.success) {
        setProjects((projectsRes.data.projects || []).slice(0, 4));
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
    if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
    if (!imagePath.startsWith('/')) return `${API_URL}/uploads/${imagePath}`;
    return null;
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
      projects: 'Projects',
      viewAllProjects: 'View All Projects',
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
      projects: 'ፕሮጀክቶች',
      viewAllProjects: 'ሁሉንም ፕሮጀክቶች ይመልከቱ',
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
              <div className="slide-bg" style={{ backgroundImage: `url(${getImageUrl(slider.image || slider.imageUrl)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
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

      {/* Categories Section - Flip Card Design */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.categoriesTitle}</h2>
            <Link to="/categories" className="view-all">{t.viewAllCategories} <i className="ri-arrow-right-line"></i></Link>
          </div>
          <div className="categories-grid">
            {categories.map((category, idx) => (
              <div className="category-item" key={idx}>
                {/* Front Card */}
                <div className="category-card" style={{ backgroundImage: `url(${getImageUrl(category.image) || ''})` }}>
                  <div className="category-overlay"></div>
                  <span className="category-badge-front">{category.count} Products</span>
                  <div className="category-front-content">
                    <button type="button">{category.name}</button>
                  </div>
                </div>
                {/* Back Card */}
                <div className="card-back" style={{ backgroundImage: `url(${getImageUrl(category.image) || ''})` }}>
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
            {featuredProducts.map(product => {
              const imageUrl = getImageUrl(product.image || product.imageUrl);
              return (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} />
                    ) : (
                      <div className="no-image"><i className="ri-image-line"></i></div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-price">ETB {product.price}</div>
                    <button onClick={() => addToCart(product)} className="add-to-cart-btn">
                      <i className="ri-shopping-cart-line"></i> {t.addToCart}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="projects-section-home">
          <div className="container">
            <div className="section-header-home">
              <h2 className="section-title">{t.projects}</h2>
              <Link to="/projects" className="view-all-link">
                {t.viewAllProjects} <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
            <div className="projects-grid-home">
              {projects.map((project) => (
                <div key={project._id} className="project-card-home">
                  <div className="project-image-home">
                    <img src={getImageUrl(project.imageUrl || project.image)} alt={project.title} />
                  </div>
                  <div className="project-info-home">
                    <h3>{language === 'en' ? project.title : (project.titleAm || project.title)}</h3>
                    <p>{language === 'en' ? project.description : (project.descriptionAm || project.description)}</p>
                    <Link to="/projects" className="view-btn">
                      {language === 'en' ? 'View Project' : 'ፕሮጀክት ይመልከቱ'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">{t.testimonials}</h2>
          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial._id} className="testimonial-card">
                <div className="testimonial-image">
                  <img src={getImageUrl(testimonial.image || testimonial.imageUrl) || 'https://via.placeholder.com/120?text=User'} alt={testimonial.name} />
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

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="home-team-section">
          <div className="container">
            <h2 className="section-title">{language === 'en' ? 'Our Team' : 'ቡድናችን'}</h2>
            <div className="home-team-grid">
              {teamMembers.map((member) => (
                <div key={member._id} className="home-team-card">
                  <img src={getImageUrl(member.imageUrl || member.image) || 'https://via.placeholder.com/140?text=Team'} alt={member.name} />
                  <h3>{language === 'en' ? member.name : (member.nameAm || member.name)}</h3>
                  <p>{language === 'en' ? member.role : (member.roleAm || member.role)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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