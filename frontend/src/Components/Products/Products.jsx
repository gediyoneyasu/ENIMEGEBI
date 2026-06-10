import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage, useCart } from '../../main';
import '../shared/ae-shared.css';
import './Products.css';
import ProductCard from '../shared/ProductCard';
import { fetchProductsPage } from '../../utils/productApi';
import { getProductImages } from '../../utils/imageHelper';

const SkeletonGrid = ({ count = 10 }) => (
  <div className="ae-skeleton-grid ae-skeleton-products">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="ae-skeleton-card">
        <div className="ae-skeleton-img" />
        <div className="ae-skeleton-line medium" />
        <div className="ae-skeleton-line short" />
      </div>
    ))}
  </div>
);

function Products() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('match');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [currentPage, setCurrentPage] = useState(1);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = ['all', 'ELECTRONICS', 'FASHION', 'HOME & KITCHEN', 'BOOKS', 'GROCERIES', 'AGRICULTURAL', 'BUSINESS', 'DELIVERY'];

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProductsPage({
        page: currentPage,
        limit: 20,
        category: selectedCategory,
        search: debouncedSearch,
        sort: sortBy,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max < 100000 ? priceRange.max : undefined
      });
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, debouncedSearch, sortBy, priceRange]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') next.delete('category');
    else next.set('category', cat);
    setSearchParams(next);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const t = {
    en: {
      search: 'Search products...', allCategories: 'All', price: 'ETB', addToCart: 'Add to Cart',
      noProducts: 'No products found', sortBy: 'Sort', bestMatch: 'Best Match',
      priceLow: 'Price: Low to High', priceHigh: 'Price: High to Low', filter: 'Filter',
      clearAll: 'Clear', priceRange: 'Price Range', apply: 'Apply', freeShipping: 'Free Shipping',
      sold: 'sold', choice: 'Choice', deals: "Today's Deals", results: 'results',
      seePreview: 'Quick View', description: 'Description', close: 'Close'
    },
    am: {
      search: 'ምርቶችን ይፈልጉ...', allCategories: 'ሁሉም', price: 'ብር', addToCart: 'ወደ ጋሪ',
      noProducts: 'ምንም ምርቶች አልተገኙም', sortBy: 'ደርድር', bestMatch: 'ተመሳሳይ',
      priceLow: 'ዋጋ ቅድሚያ', priceHigh: 'ዋጋ ከፍተኛ', filter: 'ማጣሪያ', clearAll: 'አጥፋ',
      priceRange: 'የዋጋ ክልል', apply: 'ተግብር', freeShipping: 'ነጻ አቅርቦት', sold: 'ተሽጧል',
      choice: 'ምርጥ', deals: 'የዛሬ ሽያጮች', results: 'ውጤቶች', seePreview: 'ቅድመ እይታ',
      description: 'መግለጫ', close: 'ዝጋ'
    }
  }[language];

  const cardLabels = { addToCart: t.addToCart, freeShipping: t.freeShipping, sold: t.sold, choice: t.choice };

  return (
    <div className="ae-products-page ae-products-v2">
      <div className="ae-deals-banner">
        <div className="ae-container">
          <i className="ri-flashlight-fill"></i>
          <span>{t.deals}</span>
          <strong>Up to 70% OFF</strong>
          <Link to="/products">Shop now →</Link>
        </div>
      </div>

      <div className="ae-category-nav">
        <div className="ae-container">
          <div className="ae-category-list">
            {categories.map((cat) => (
              <button key={cat} type="button" className={`ae-cat-btn ${selectedCategory === cat ? 'active' : ''}`} onClick={() => handleCategoryChange(cat)}>
                {cat === 'all' ? t.allCategories : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ae-container">
        <div className="ae-main-layout">
          <aside className={`ae-sidebar ${showFilters ? 'open' : ''}`}>
            <div className="ae-sidebar-header">
              <h3>{t.filter}</h3>
              <button type="button" onClick={() => { setPriceRange({ min: 0, max: 100000 }); setSelectedCategory('all'); setSortBy('match'); setSearchTerm(''); setCurrentPage(1); }}>
                {t.clearAll}
              </button>
            </div>
            <div className="ae-filter-section">
              <h4>{t.priceRange}</h4>
              <div className="ae-price-inputs">
                <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })} />
                <span>-</span>
                <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })} />
              </div>
              <button type="button" className="ae-apply-btn" onClick={() => setCurrentPage(1)}>{t.apply}</button>
            </div>
          </aside>

          <div className="ae-main-content">
            <div className="ae-sort-bar">
              <div className="ae-sort-left">
                <div className="ae-search-container">
                  <i className="ri-search-line ae-search-icon"></i>
                  <input type="text" placeholder={t.search} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="ae-search-input" />
                  {searchTerm && (
                    <button type="button" className="ae-clear-search" onClick={() => setSearchTerm('')}>
                      <i className="ri-close-line"></i>
                    </button>
                  )}
                </div>
                <span className="ae-result-count">{total} {t.results}</span>
              </div>
              <div className="ae-sort-right">
                <span>{t.sortBy}:</span>
                <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                  <option value="match">{t.bestMatch}</option>
                  <option value="price_asc">{t.priceLow}</option>
                  <option value="price_desc">{t.priceHigh}</option>
                </select>
                <button type="button" className="ae-filter-mobile" onClick={() => setShowFilters(!showFilters)}>
                  <i className="ri-filter-3-line"></i> {t.filter}
                </button>
              </div>
            </div>

            {loading ? (
              <SkeletonGrid count={10} />
            ) : products.length === 0 ? (
              <div className="ae-no-results">
                <i className="ri-shopping-bag-line"></i>
                <h3>{t.noProducts}</h3>
              </div>
            ) : (
              <>
                <div className="ae-products-grid ae-grid-v2">
                  {products.map((product) => (
                    <div key={product._id} className="ae-product-wrap">
                      <ProductCard product={product} onAddToCart={handleAddToCart} labels={cardLabels} />
                      <button type="button" className="ae-quick-view-btn" onClick={() => { setPreviewProduct(product); setCurrentImageIndex(0); }}>
                        <i className="ri-eye-line"></i> {t.seePreview}
                      </button>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="ae-pagination">
                    <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>‹</button>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum = i + 1;
                      if (totalPages > 5) {
                        if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button key={i} type="button" className={currentPage === pageNum ? 'active' : ''} onClick={() => setCurrentPage(pageNum)}>
                          {pageNum}
                        </button>
                      );
                    })}
                    <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {previewProduct && (
        <div className="ae-quickview-modal" onClick={() => setPreviewProduct(null)} role="presentation">
          <div className="ae-quickview-content" onClick={(e) => e.stopPropagation()} role="dialog">
            <button type="button" className="ae-quickview-close" onClick={() => setPreviewProduct(null)}>
              <i className="ri-close-line"></i>
            </button>
            <div className="ae-quickview-body">
              <div className="ae-quickview-gallery">
                <img src={getProductImages(previewProduct)[currentImageIndex]} alt={previewProduct.name} />
              </div>
              <div className="ae-quickview-info">
                <h2>{previewProduct.name}</h2>
                <div className="ae-quickview-price">{t.price} {previewProduct.price?.toLocaleString()}</div>
                <p>{previewProduct.description || `${previewProduct.name} - premium quality product.`}</p>
                <Link to={`/product/${previewProduct._id}`} className="ae-quickview-link">View full details →</Link>
                <button type="button" className="ae-quickview-addcart" onClick={(e) => handleAddToCart(previewProduct, e)}>
                  <i className="ri-shopping-cart-line"></i> {t.addToCart}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
