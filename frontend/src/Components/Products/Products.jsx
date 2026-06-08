import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage, useCart } from '../../main';
import './Products.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

function Products() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('match');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const itemsPerPage = 20;

  const categories = [
    'all', 'ELECTRONICS', 'FASHION', 'HOME & KITCHEN', 'BOOKS', 
    'GROCERIES', 'AGRICULTURAL', 'BUSINESS', 'DELIVERY'
  ];

  useEffect(() => {
    fetchProducts();
    const savedWishlist = localStorage.getItem('emarkato_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/public-products`);
      const processedProducts = response.data.filter(p => p.status === 'active').map(product => ({
        ...product,
        images: product.images || [product.imageUrl || product.image].filter(Boolean),
        mainImage: product.imageUrl || product.image,
        rating: product.rating || (Math.random() * 1.5 + 3.5).toFixed(1),
        reviews: product.reviews || Math.floor(Math.random() * 500) + 10,
        seller: product.seller || 'Official Store'
      }));
      setProducts(processedProducts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const toggleWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    let newWishlist;
    if (wishlist.includes(product._id)) {
      newWishlist = wishlist.filter(id => id !== product._id);
    } else {
      newWishlist = [...wishlist, product._id];
    }
    setWishlist(newWishlist);
    localStorage.setItem('emarkato_wishlist', JSON.stringify(newWishlist));
  };

  const openQuickView = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
    const similar = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);
    setSimilarProducts(similar);
    document.body.style.overflow = 'hidden';
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
    setSimilarProducts([]);
    document.body.style.overflow = 'auto';
  };

  const handleMouseEnter = (productId) => {
    setHoveredProduct(productId);
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const product = products.find(p => p._id === productId);
        if (product && product.images && product.images.length > 1) {
          const currentIndex = prev[productId] || 0;
          const nextIndex = (currentIndex + 1) % product.images.length;
          return { ...prev, [productId]: nextIndex };
        }
        return prev;
      });
    }, 800);
    window[`interval_${productId}`] = interval;
  };

  const handleMouseLeave = (productId) => {
    setHoveredProduct(null);
    if (window[`interval_${productId}`]) {
      clearInterval(window[`interval_${productId}`]);
      delete window[`interval_${productId}`];
    }
    setCurrentImageIndex(prev => ({ ...prev, [productId]: 0 }));
  };

  const getCurrentImage = (product) => {
    if (hoveredProduct === product._id && product.images && product.images.length > 1) {
      const index = currentImageIndex[product._id] || 0;
      return product.images[index];
    }
    return product.mainImage;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
    return `${API_URL}/uploads/${imagePath}`;
  };

  const getFilteredProducts = () => {
    let filtered = [...products];
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const translations = {
    en: {
      search: 'Search products...',
      allCategories: 'All Categories',
      price: 'ETB',
      addToCart: 'Add to Cart',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      noProducts: 'No products found',
      sortBy: 'Sort by',
      bestMatch: 'Best Match',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      newest: 'Newest First',
      rating: 'Top Rated',
      filter: 'Filter',
      clearAll: 'Clear All',
      priceRange: 'Price Range',
      apply: 'Apply',
      freeShipping: 'Free Shipping',
      sold: 'sold',
      ratings: 'ratings',
      viewMore: 'View More',
      page: 'Page',
      seePreview: 'Quick View',
      similarItems: 'You May Also Like',
      buyNow: 'Buy Now',
      close: 'Close',
      seller: 'Sold by',
      addToWishlist: 'Add to wishlist',
      removeFromWishlist: 'Remove from wishlist'
    },
    am: {
      search: 'ምርቶችን ይፈልጉ...',
      allCategories: 'ሁሉም ምድቦች',
      price: 'ብር',
      addToCart: 'ወደ ጋሪ ጨምር',
      inStock: 'ክምችት አለ',
      outOfStock: 'ክምችት የለም',
      noProducts: 'ምንም ምርቶች አልተገኙም',
      sortBy: 'ደርድር',
      bestMatch: 'ተመሳሳይ',
      priceLow: 'ዋጋ ቅድሚያ',
      priceHigh: 'ዋጋ ከፍተኛ',
      newest: 'አዲስ',
      rating: 'ከፍተኛ ደረጃ',
      filter: 'ማጣሪያ',
      clearAll: 'ሁሉንም አጥፋ',
      priceRange: 'የዋጋ ክልል',
      apply: 'ተግብር',
      freeShipping: 'ነጻ አቅርቦት',
      sold: 'ተሽጧል',
      ratings: 'ግምገማዎች',
      viewMore: 'ተጨማሪ ይመልከቱ',
      page: 'ገጽ',
      seePreview: 'ቅድመ እይታ',
      similarItems: 'ሊወዷቸው ይችላሉ',
      buyNow: 'አሁን ግዛ',
      close: 'ዝጋ',
      seller: 'ሻጭ',
      addToWishlist: 'ወደ ምኞት ዝርዝር ጨምር',
      removeFromWishlist: 'ከምኞት ዝርዝር አስወግድ'
    }
  };

  const t = translations[language];

  const getCategoryIcon = (cat) => {
    const icons = {
      'ELECTRONICS': 'ri-smartphone-line',
      'FASHION': 'ri-shirt-line',
      'HOME & KITCHEN': 'ri-home-smile-line',
      'BOOKS': 'ri-book-open-line',
      'GROCERIES': 'ri-shopping-basket-line',
      'AGRICULTURAL': 'ri-seedling-line',
      'BUSINESS': 'ri-briefcase-line',
      'DELIVERY': 'ri-truck-line',
    };
    return icons[cat] || 'ri-folder-line';
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="ri-star-fill"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="ri-star-half-fill"></i>);
      } else {
        stars.push(<i key={i} className="ri-star-line"></i>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="ae-loading">
        <div className="ae-loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="ae-products-page">
      <div className="ae-category-nav">
        <div className="ae-container">
          <div className="ae-category-list">
            {categories.map(cat => (
              <button
                key={cat}
                className={`ae-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? (
                  <><i className="ri-apps-line"></i> {t.allCategories}</>
                ) : (
                  <><i className={getCategoryIcon(cat)}></i> {cat}</>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ae-container">
        <div className="ae-main-layout">
          <div className={`ae-sidebar ${showFilters ? 'open' : ''}`}>
            <div className="ae-sidebar-header">
              <h3>{t.filter}</h3>
              <button onClick={() => {
                setPriceRange({ min: 0, max: 10000 });
                setSelectedCategory('all');
                setSortBy('match');
              }}>{t.clearAll}</button>
            </div>

            <div className="ae-filter-section">
              <h4>{t.priceRange}</h4>
              <div className="ae-price-inputs">
                <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} />
                <span>-</span>
                <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} />
              </div>
              <button className="ae-apply-btn" onClick={() => setCurrentPage(1)}>{t.apply}</button>
            </div>

            <div className="ae-filter-section">
              <h4>Categories</h4>
              <div className="ae-filter-categories">
                {categories.filter(c => c !== 'all').map(cat => (
                  <label key={cat} className="ae-filter-checkbox">
                    <input type="radio" name="category" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} />
                    <span>{cat}</span>
                    <span className="ae-count">({products.filter(p => p.category === cat).length})</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="ae-main-content">
            <div className="ae-sort-bar">
              <div className="ae-sort-left">
                <span className="ae-result-count">{filteredProducts.length} products found</span>
              </div>
              <div className="ae-sort-right">
                <span>{t.sortBy}:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="match">{t.bestMatch}</option>
                  <option value="price_asc">{t.priceLow}</option>
                  <option value="price_desc">{t.priceHigh}</option>
                  <option value="rating">{t.rating}</option>
                  <option value="newest">{t.newest}</option>
                </select>
                <button className="ae-filter-mobile" onClick={() => setShowFilters(!showFilters)}>
                  <i className="ri-filter-3-line"></i> {t.filter}
                </button>
              </div>
            </div>

            {paginatedProducts.length === 0 ? (
              <div className="ae-no-results">
                <i className="ri-search-eye-line"></i>
                <h3>{t.noProducts}</h3>
              </div>
            ) : (
              <>
                <div className="ae-products-grid">
                  {paginatedProducts.map(product => {
                    const discount = product.discount || Math.floor(Math.random() * 30) + 10;
                    const originalPrice = Math.floor(product.price * (1 + discount / 100));
                    const rating = parseFloat(product.rating) || 4.0;
                    const reviews = product.reviews;
                    const soldCount = product.soldCount || Math.floor(Math.random() * 1000) + 10;
                    const hasMultipleImages = product.images && product.images.length > 1;
                    const currentImage = getCurrentImage(product);
                    const isInWishlist = wishlist.includes(product._id);
                    
                    return (
                      <div 
                        key={product._id} 
                        className="ae-product-card"
                        onMouseEnter={() => hasMultipleImages && handleMouseEnter(product._id)}
                        onMouseLeave={() => hasMultipleImages && handleMouseLeave(product._id)}
                      >
                        {/* Wishlist Heart Button */}
                        <button className="ae-wishlist-btn" onClick={(e) => toggleWishlist(product, e)}>
                          <i className={isInWishlist ? 'ri-heart-fill' : 'ri-heart-line'}></i>
                        </button>
                        
                        <div className="ae-product-image">
                          <img src={getImageUrl(currentImage) || 'https://via.placeholder.com/200'} alt={product.name} />
                          {discount > 15 && (
                            <span className="ae-discount-badge">-{discount}%</span>
                          )}
                          {hasMultipleImages && (
                            <div className="ae-multi-image-indicator">
                              {product.images.map((_, idx) => (
                                <span key={idx} className={`ae-image-dot ${hoveredProduct === product._id && currentImageIndex[product._id] === idx ? 'active' : ''}`}></span>
                              ))}
                            </div>
                          )}
                          <div className="ae-image-zoom">
                            <i className="ri-zoom-in-line"></i>
                          </div>
                        </div>
                        
                        <div className="ae-product-info">
                          <h3 className="ae-product-title">{product.name}</h3>
                          
                          {/* Seller Name */}
                          <div className="ae-seller">
                            <i className="ri-store-line"></i>
                            <span>{product.seller}</span>
                          </div>
                          
                          {/* Rating Stars */}
                          <div className="ae-rating">
                            <div className="ae-stars">{renderStars(rating)}</div>
                            <span className="ae-rating-value">{rating}</span>
                            <span className="ae-review-count">({reviews} {t.ratings})</span>
                          </div>
                          
                          <div className="ae-price-section">
                            <span className="ae-current-price">{t.price} {product.price.toLocaleString()}</span>
                            <span className="ae-original-price">{t.price} {originalPrice.toLocaleString()}</span>
                          </div>
                          
                          <div className="ae-shipping">
                            <i className="ri-truck-line"></i> {t.freeShipping}
                          </div>
                          <div className="ae-sold-count">🔥 {soldCount}+ {t.sold}</div>
                          
                          <div className="ae-card-actions">
                            <button className="ae-preview-btn" onClick={(e) => openQuickView(product, e)}>
                              <i className="ri-eye-line"></i> {t.seePreview}
                            </button>
                            <button className="ae-add-to-cart" onClick={(e) => handleAddToCart(product, e)} disabled={product.stock === 0}>
                              <i className="ri-shopping-cart-line"></i> {t.addToCart}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="ae-pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;
                      return (<button key={i} className={currentPage === pageNum ? 'active' : ''} onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>);
                    })}
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="qv-overlay" onClick={closeQuickView}>
          <div className="qv-modal" onClick={(e) => e.stopPropagation()}>
            <button className="qv-close" onClick={closeQuickView}>✕</button>
            
            <div className="qv-content">
              <div className="qv-gallery">
                <div className="qv-main-image">
                  <img src={getImageUrl(quickViewProduct.mainImage)} alt={quickViewProduct.name} />
                </div>
                {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                  <div className="qv-thumbnails">
                    {quickViewProduct.images.slice(0, 4).map((img, idx) => (
                      <div key={idx} className="qv-thumb">
                        <img src={getImageUrl(img)} alt={`View ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="qv-info">
                <h2>{quickViewProduct.name}</h2>
                <div className="qv-seller">
                  <i className="ri-store-line"></i> {quickViewProduct.seller}
                </div>
                <div className="qv-rating">
                  {renderStars(quickViewProduct.rating)}
                  <span>{quickViewProduct.rating}</span>
                  <span>({quickViewProduct.reviews} {t.ratings})</span>
                </div>
                <div className="qv-price">
                  <span className="qv-current-price">{t.price} {quickViewProduct.price.toLocaleString()}</span>
                </div>
                <div className="qv-shipping">
                  <i className="ri-truck-line"></i> {t.freeShipping}
                </div>
                <div className="qv-buttons">
                  <button className="qv-add-to-cart" onClick={() => { addToCart(quickViewProduct); closeQuickView(); }}>
                    <i className="ri-shopping-cart-line"></i> {t.addToCart}
                  </button>
                  <Link to={`/product/${quickViewProduct._id}`} className="qv-buy-now" onClick={closeQuickView}>
                    {t.buyNow}
                  </Link>
                </div>
              </div>
            </div>
            
            {similarProducts.length > 0 && (
              <div className="qv-similar">
                <h3>{t.similarItems}</h3>
                <div className="qv-similar-grid">
                  {similarProducts.map(product => (
                    <Link key={product._id} to={`/product/${product._id}`} className="qv-similar-item" onClick={closeQuickView}>
                      <img src={getImageUrl(product.mainImage)} alt={product.name} />
                      <span className="qv-similar-name">{product.name}</span>
                      <span className="qv-similar-price">{t.price} {product.price.toLocaleString()}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;