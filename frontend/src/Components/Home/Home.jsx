import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../main';
import { useCart } from '../../main';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../shared/ae-shared.css';
import './Home.css';
import ProductCard from '../shared/ProductCard';
import { fetchHomeData } from '../../utils/productApi';

const staticBrandData = {
  banners: [
    { id: 1, image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg', title: 'Super Sale!', subtitle: 'Up to 70% Off on Electronics', btnText: 'Shop Now' },
    { id: 2, image: 'https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg', title: 'Fashion Week', subtitle: 'Get 50% Off on Latest Collection', btnText: 'Explore' },
    { id: 3, image: 'https://images.pexels.com/photos/4397842/pexels-photo-4397842.jpeg', title: 'Free Delivery', subtitle: 'On orders over ETB 1000', btnText: 'Order Now' }
  ],
  categoriesList: [
    { name: 'ELECTRONICS', icon: 'ri-smartphone-line', color: '#FF4747' },
    { name: 'FASHION', icon: 'ri-shirt-line', color: '#FF6B00' },
    { name: 'HOME & KITCHEN', icon: 'ri-home-smile-line', color: '#00A650' },
    { name: 'BOOKS', icon: 'ri-book-open-line', color: '#9B59B6' },
    { name: 'GROCERIES', icon: 'ri-shopping-basket-line', color: '#3498DB' },
    { name: 'AGRICULTURAL', icon: 'ri-seedling-line', color: '#27AE60' },
    { name: 'BUSINESS', icon: 'ri-briefcase-line', color: '#F39C12' },
    { name: 'DELIVERY', icon: 'ri-truck-line', color: '#1ABC9C' }
  ],
  coupons: [
    { off: 'ETB 50', desc: 'Orders 500+', code: 'SAVE50' },
    { off: 'ETB 100', desc: 'Orders 1000+', code: 'SAVE100' },
    { off: '15% OFF', desc: 'Electronics', code: 'TECH15' },
    { off: 'Free Ship', desc: 'First order', code: 'FREESHIP' }
  ]
};

const SkeletonGrid = ({ count = 6 }) => (
  <div className="ae-skeleton-grid">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="ae-skeleton-card">
        <div className="ae-skeleton-img" />
        <div className="ae-skeleton-line medium" />
        <div className="ae-skeleton-line short" />
      </div>
    ))}
  </div>
);

function Home() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [flashDeals, setFlashDeals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [activeDealTab, setActiveDealTab] = useState('flash');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchHomeData()
      .then((data) => {
        setFlashDeals(data.flashDeals || []);
        setBestSellers(data.bestSellers || []);
        setFeaturedProducts(data.featured || []);
        const counts = {};
        (data.categories || []).forEach((c) => { counts[c.name] = c.count; });
        setCategoryCounts(counts);
      })
      .catch((err) => {
        console.error('Home load error:', err);
        setFlashDeals([]);
        setBestSellers([]);
        setFeaturedProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const t = {
    en: {
      flashDeals: 'Flash Deals', superDeals: 'Super Deals', endsIn: 'Ends in:', viewAll: 'View All',
      shopByCategory: 'Shop by Category', bestSellers: 'Best Sellers', featuredProducts: 'Recommended',
      megaSale: 'Mega Sale!', upToOff: 'Up to 70% OFF', limitedTime: 'Limited time offer', shopNow: 'Shop Now',
      addToCart: 'Add to Cart', freeShipping: 'Free Shipping', sold: 'sold', choice: 'Choice',
      coupons: 'Coupons & Deals', grabCoupon: 'Get Coupon'
    },
    am: {
      flashDeals: 'ፍላሽ ሽያጮች', superDeals: 'ሱፐር ሽያጮች', endsIn: 'የሚያበቃው:', viewAll: 'ሁሉንም',
      shopByCategory: 'በምድብ ይግዙ', bestSellers: 'በሽያጭ የተሻሉ', featuredProducts: 'የተመረጡ',
      megaSale: 'ሜጋ ሽያጭ!', upToOff: 'እስከ 70% ቅናሽ', limitedTime: 'የተወሰነ ጊዜ', shopNow: 'አሁን ይግዙ',
      addToCart: 'ወደ ጋሪ', freeShipping: 'ነጻ አቅርቦት', sold: 'ተሽጧል', choice: 'ምርጥ',
      coupons: 'ኩፖኖች', grabCoupon: 'አግኝ'
    }
  }[language];

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const cardLabels = { addToCart: t.addToCart, freeShipping: t.freeShipping, sold: t.sold, choice: t.choice };

  return (
    <div className="ae-home-page ae-home-v2">
      <div className="ae-home-container">
        <div className="ae-banner-section">
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4500 }} loop pagination={{ clickable: true }} className="ae-banner-swiper">
            {staticBrandData.banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="ae-banner-slide">
                  <img src={banner.image} alt={banner.title} className="ae-banner-img" loading="eager" decoding="async" />
                  <div className="ae-banner-content">
                    <span className="ae-banner-badge">HOT</span>
                    <h2>{banner.title}</h2>
                    <p>{banner.subtitle}</p>
                    <Link to="/products" className="ae-banner-btn">{banner.btnText}</Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="ae-section ae-coupon-section">
          <div className="ae-section-header compact">
            <h2 className="ae-section-title"><i className="ri-coupon-3-line"></i> {t.coupons}</h2>
          </div>
          <div className="ae-coupon-strip">
            {staticBrandData.coupons.map((c) => (
              <div key={c.code} className="ae-coupon">
                <strong>{c.off}</strong>
                <span>{c.desc}</span>
                <small>{t.grabCoupon}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="ae-section ae-flash-section">
          <div className="ae-deals-tabs">
            <button type="button" className={`ae-deals-tab ${activeDealTab === 'flash' ? 'active' : ''}`} onClick={() => setActiveDealTab('flash')}>
              <i className="ri-flashlight-fill"></i> {t.flashDeals}
            </button>
            <button type="button" className={`ae-deals-tab ${activeDealTab === 'super' ? 'active' : ''}`} onClick={() => setActiveDealTab('super')}>
              {t.superDeals}
            </button>
          </div>
          <div className="ae-flash-header">
            <div className="ae-timer">
              <span className="ae-timer-label">{t.endsIn}</span>
              <div className="ae-timer-box"><span className="ae-timer-num">{String(timeLeft.hours).padStart(2, '0')}</span><span className="ae-timer-unit">h</span></div>
              <span className="ae-timer-sep">:</span>
              <div className="ae-timer-box"><span className="ae-timer-num">{String(timeLeft.minutes).padStart(2, '0')}</span><span className="ae-timer-unit">m</span></div>
              <span className="ae-timer-sep">:</span>
              <div className="ae-timer-box"><span className="ae-timer-num">{String(timeLeft.seconds).padStart(2, '0')}</span><span className="ae-timer-unit">s</span></div>
            </div>
            <Link to="/products" className="ae-view-all">{t.viewAll} <i className="ri-arrow-right-s-line"></i></Link>
          </div>
          {loading ? (
            <div className="ae-flash-scroll">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="ae-skeleton-card ae-card--flash">
                  <div className="ae-skeleton-img" />
                  <div className="ae-skeleton-line medium" />
                </div>
              ))}
            </div>
          ) : (
            <div className="ae-flash-scroll">
              {(activeDealTab === 'flash' ? flashDeals : bestSellers).map((product) => (
                <ProductCard key={product._id} product={product} variant="flash" onAddToCart={handleAddToCart} labels={cardLabels} />
              ))}
            </div>
          )}
        </div>

        <div className="ae-section">
          <div className="ae-section-header compact">
            <h2 className="ae-section-title">{t.shopByCategory}</h2>
            <Link to="/categories" className="ae-view-all">{t.viewAll} <i className="ri-arrow-right-s-line"></i></Link>
          </div>
          <div className="ae-categories-grid ae-cat-v2">
            {staticBrandData.categoriesList.map((cat) => (
              <Link to={`/products?category=${cat.name}`} key={cat.name} className="ae-category-card">
                <div className="ae-category-icon" style={{ backgroundColor: `${cat.color}15` }}>
                  <i className={cat.icon} style={{ color: cat.color }}></i>
                </div>
                <span className="ae-category-name">{cat.name}</span>
                <span className="ae-category-count">{categoryCounts[cat.name] || 0} items</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="ae-section">
          <div className="ae-section-header compact">
            <h2 className="ae-section-title"><i className="ri-fire-fill"></i> {t.bestSellers}</h2>
            <Link to="/products" className="ae-view-all">{t.viewAll}</Link>
          </div>
          {loading ? <SkeletonGrid count={6} /> : (
            <div className="ae-products-grid ae-grid-v2">
              {bestSellers.slice(0, 6).map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} labels={cardLabels} />
              ))}
            </div>
          )}
        </div>

        <Link to="/products" className="ae-mega-banner ae-mega-v2">
          <div className="ae-mega-content">
            <h3>{t.megaSale}</h3>
            <p>{t.upToOff}</p>
            <span>{t.limitedTime}</span>
          </div>
          <div className="ae-mega-btn">{t.shopNow} <i className="ri-arrow-right-line"></i></div>
        </Link>

        <div className="ae-section">
          <div className="ae-section-header compact">
            <h2 className="ae-section-title">{t.featuredProducts}</h2>
            <Link to="/products" className="ae-view-all">{t.viewAll}</Link>
          </div>
          {loading ? <SkeletonGrid count={8} /> : (
            <div className="ae-products-grid ae-grid-v2">
              {featuredProducts.slice(0, 12).map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} labels={cardLabels} />
              ))}
            </div>
          )}
        </div>

        <div className="ae-trust-badge">
          <i className="ri-shield-check-line"></i>
          <span>Secure Payment · Free Returns · 24/7 Support</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
