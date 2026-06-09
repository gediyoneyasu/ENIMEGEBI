import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage, useCart } from '../../main';
import './Products.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function Products() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('match');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [currentPage, setCurrentPage] = useState(1);
  
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarProductsList, setSimilarProductsList] = useState([]);
  const [showSimilarModal, setShowSimilarModal] = useState(false);
  
  const itemsPerPage = 20;
  const categories = ['all', 'ELECTRONICS', 'FASHION', 'HOME & KITCHEN', 'BOOKS', 'GROCERIES', 'AGRICULTURAL', 'BUSINESS', 'DELIVERY'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/public-products`);
      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data && response.data.products) {
        productsData = response.data.products;
      }
      setProducts(productsData);
    } catch (error) {
      console.error('Error:', error);
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

  const openSeePreview = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewProduct(product);
    setCurrentImageIndex(0);
    setShowPreviewModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeSeePreview = () => {
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

  const openSimilarItems = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const similar = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 8);
    setSimilarProductsList(similar);
    setShowSimilarModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeSimilarModal = () => {
    setShowSimilarModal(false);
    setSimilarProductsList([]);
    document.body.style.overflow = 'auto';
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    alert(`Added ${product.name} to cart!`);
  };

  const getFilteredProducts = () => {
    let filtered = [...products];
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p?.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(p => p?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    filtered = filtered.filter(p => (p?.price || 0) >= priceRange.min && (p?.price || 0) <= priceRange.max);
    if (sortBy === 'price_asc') filtered.sort((a, b) => (a?.price || 0) - (b?.price || 0));
    if (sortBy === 'price_desc') filtered.sort((a, b) => (b?.price || 0) - (a?.price || 0));
    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const t = {
    en: {
      search: 'Search products...',
      allCategories: 'All Categories',
      price: 'ETB',
      addToCart: 'Add to Cart',
      noProducts: 'No products found',
      sortBy: 'Sort by',
      bestMatch: 'Best Match',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      filter: 'Filter',
      clearAll: 'Clear All',
      priceRange: 'Price Range',
      apply: 'Apply',
      freeShipping: 'Free Shipping',
      sold: 'sold',
      seePreview: 'See preview',
      similarItems: 'Similar items',
      description: 'Description',
      close: 'Close'
    },
    am: {
      search: 'ምርቶችን ይፈልጉ...',
      allCategories: 'ሁሉም ምድቦች',
      price: 'ብር',
      addToCart: 'ወደ ጋሪ ጨምር',
      noProducts: 'ምንም ምርቶች አልተገኙም',
      sortBy: 'ደርድር',
      bestMatch: 'ተመሳሳይ',
      priceLow: 'ዋጋ ቅድሚያ',
      priceHigh: 'ዋጋ ከፍተኛ',
      filter: 'ማጣሪያ',
      clearAll: 'ሁሉንም አጥፋ',
      priceRange: 'የዋጋ ክልል',
      apply: 'ተግብር',
      freeShipping: 'ነጻ አቅርቦት',
      sold: 'ተሽጧል',
      seePreview: 'ቅድመ እይታ',
      similarItems: 'ተመሳሳይ ምርቶች',
      description: 'መግለጫ',
      close: 'ዝጋ'
    }
  }[language];

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
                {cat === 'all' ? t.allCategories : cat}
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
              <button onClick={() => { setPriceRange({ min: 0, max: 100000 }); setSelectedCategory('all'); setSortBy('match'); }}>
                {t.clearAll}
              </button>
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
          </div>

          <div className="ae-main-content">
            <div className="ae-sort-bar">
              <div className="ae-sort-left">
                <div className="ae-search-container">
                  <i className="ri-search-line ae-search-icon"></i>
                  <input type="text" placeholder={t.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="ae-search-input" />
                  {searchTerm && (
                    <button className="ae-clear-search" onClick={() => setSearchTerm('')}>
                      <i className="ri-close-line"></i>
                    </button>
                  )}
                </div>
                <span className="ae-result-count">{filteredProducts.length} products found</span>
              </div>
              <div className="ae-sort-right">
                <span>{t.sortBy}:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="match">{t.bestMatch}</option>
                  <option value="price_asc">{t.priceLow}</option>
                  <option value="price_desc">{t.priceHigh}</option>
                </select>
                <button className="ae-filter-mobile" onClick={() => setShowFilters(!showFilters)}>
                  <i className="ri-filter-3-line"></i> {t.filter}
                </button>
              </div>
            </div>

            {paginatedProducts.length === 0 ? (
              <div className="ae-no-results">
                <i className="ri-shopping-bag-line"></i>
                <h3>{t.noProducts}</h3>
              </div>
            ) : (
              <>
                <div className="ae-products-grid">
                  {paginatedProducts.map(product => {
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
                          <div className="ae-product-image">
                            <img src={productImages[0]} alt={product.name} />
                            {discount > 15 && <span className="ae-discount-badge">-{discount}%</span>}
                          </div>
                          <div className="ae-product-info">
                            <h3 className="ae-product-title">{product.name}</h3>
                            <div className="ae-price-section">
                              <span className="ae-current-price">{t.price} {product.price.toLocaleString()}</span>
                              <span className="ae-original-price">{t.price} {originalPrice.toLocaleString()}</span>
                            </div>
                            <div className="ae-shipping">
                              <i className="ri-truck-line"></i> {t.freeShipping}
                            </div>
                            <div className="ae-rating">
                              <div className="ae-stars">★★★★☆</div>
                              <span className="ae-rating-count">({soldCount}+ {t.sold})</span>
                            </div>
                          </div>
                        </Link>
                        
                        {/* Add to Cart Button - ALWAYS VISIBLE */}
                        <button className="ae-add-to-cart" onClick={(e) => handleAddToCart(product, e)}>
                          <i className="ri-shopping-cart-line"></i> {t.addToCart}
                        </button>
                        
                        {/* HOVER OVERLAY - Only See Preview and Similar Items buttons */}
                        {isHovered && (
                          <div className="ae-hover-overlay">
                            <button 
                              className="ae-see-preview-btn"
                              onClick={(e) => openSeePreview(product, e)}
                            >
                              <i className="ri-eye-line"></i> {t.seePreview}
                            </button>
                            <button 
                              className="ae-similar-btn"
                              onClick={(e) => openSimilarItems(product, e)}
                            >
                              <i className="ri-list-check-line"></i> {t.similarItems}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {totalPages > 1 && (
                  <div className="ae-pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum = i + 1;
                      if (totalPages > 5) {
                        if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button key={i} className={currentPage === pageNum ? 'active' : ''} onClick={() => setCurrentPage(pageNum)}>
                          {pageNum}
                        </button>
                      );
                    })}
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* See Preview Modal */}
      {showPreviewModal && previewProduct && (
        <div className="ae-quickview-modal" onClick={closeSeePreview}>
          <div className="ae-quickview-content" onClick={(e) => e.stopPropagation()}>
            <button className="ae-quickview-close" onClick={closeSeePreview}>
              <i className="ri-close-line"></i>
            </button>
            
            <div className="ae-quickview-body">
              <div className="ae-quickview-gallery">
                <div className="ae-quickview-main-image">
                  <img src={getProductImages(previewProduct)[currentImageIndex]} alt={previewProduct.name} />
                  <div className="ae-quickview-counter">
                    {currentImageIndex + 1} / {getProductImages(previewProduct).length}
                  </div>
                  {getProductImages(previewProduct).length > 1 && (
                    <>
                      <button className="ae-quickview-nav prev" onClick={prevImage}>‹</button>
                      <button className="ae-quickview-nav next" onClick={nextImage}>›</button>
                    </>
                  )}
                </div>
                <div className="ae-quickview-thumbs">
                  {getProductImages(previewProduct).map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`ae-quickview-thumb ${currentImageIndex === idx ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <img src={img} alt={`thumb ${idx + 1}`} />
                      <span>{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="ae-quickview-info">
                <h2 className="ae-quickview-title">{previewProduct.name}</h2>
                <div className="ae-quickview-price">
                  <span className="current">{t.price} {previewProduct.price.toLocaleString()}</span>
                </div>
                <div className="ae-quickview-description">
                  <h4>{t.description}</h4>
                  <p>{previewProduct.description || `High quality ${previewProduct.name} with premium features.`}</p>
                </div>
                <button className="ae-quickview-addcart" onClick={(e) => handleAddToCart(previewProduct, e)}>
                  <i className="ri-shopping-cart-line"></i> {t.addToCart}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Similar Items Modal */}
      {showSimilarModal && (
        <div className="ae-similar-modal" onClick={closeSimilarModal}>
          <div className="ae-similar-content" onClick={(e) => e.stopPropagation()}>
            <button className="ae-quickview-close" onClick={closeSimilarModal}>
              <i className="ri-close-line"></i>
            </button>
            <h2><i className="ri-list-check-line"></i> {t.similarItems}</h2>
            <div className="ae-similar-products-grid">
              {similarProductsList.map(similar => (
                <div 
                  key={similar._id} 
                  className="ae-similar-product-card"
                  onClick={() => {
                    closeSimilarModal();
                    setPreviewProduct(similar);
                    setCurrentImageIndex(0);
                    setShowPreviewModal(true);
                  }}
                >
                  <img src={getImageUrl(similar.image || similar.imageUrl)} alt={similar.name} />
                  <h4>{similar.name}</h4>
                  <p>{t.price} {similar.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
