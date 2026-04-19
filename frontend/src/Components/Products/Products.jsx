import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../main';
import { useCart } from '../../main';
import './Products.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

function Products() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('enimegebiToken');
      console.log('Fetching products from:', `${API_URL}/api/admin/public-products`);
      
      const response = await axios.get(`${API_URL}/api/admin/public-products`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      console.log('Products received:', response.data.length);
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (product) => {
    if (product.imageUrl) return product.imageUrl;
    if (product.image) {
      if (product.image.startsWith('http')) return product.image;
      return `${API_URL}${product.image}`;
    }
    return null;
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const translations = {
    en: {
      title: 'Our Products',
      subtitle: 'Fresh, organic, and locally sourced products',
      search: 'Search products...',
      allCategories: 'All Products',
      price: 'ETB',
      addToCart: 'Add to Cart',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      noProducts: 'No products found',
      error: 'Failed to load products. Please try again.',
      retry: 'Retry'
    },
    am: {
      title: 'ምርቶቻችን',
      subtitle: 'ትኩስ፣ ኦርጋኒክ እና በአገር ውስጥ የሚገኙ ምርቶች',
      search: 'ምርቶችን ይፈልጉ...',
      allCategories: 'ሁሉም ምርቶች',
      price: 'ብር',
      addToCart: 'ወደ ጋሪ ጨምር',
      inStock: 'ክምችት አለ',
      outOfStock: 'ክምችት የለም',
      noProducts: 'ምንም ምርቶች አልተገኙም',
      error: 'ምርቶችን ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።',
      retry: 'እንደገና ሞክር'
    }
  };

  const t = translations[language];
  const categories = ['all', 'Coffee', 'Grains', 'Honey', 'Dairy', 'Fruits', 'Vegetables', 'Spices', 'Beverages'];

  const filteredProducts = products.filter(product => {
    if (!product) return false;
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const productName = language === 'en' ? product.name : (product.nameAm || product.name);
    const matchesSearch = productName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return matchesCategory && matchesSearch && product.status !== 'inactive';
  });

  if (loading) {
    return (
      <div className="products-loading">
        <i className="ri-loader-4-line ri-spin"></i>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <i className="ri-error-warning-line"></i>
        <p>{t.error}</p>
        <button onClick={fetchProducts} className="retry-btn">{t.retry}</button>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="products-hero-content">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="search-bar">
            <i className="ri-search-line"></i>
            <input 
              type="text" 
              placeholder={t.search} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="categories-section">
        <div className="container">
          <div className="categories-grid">
            {categories.map(category => (
              <button
                key={category}
                className={`category-card ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                <span>{category === 'all' ? t.allCategories : category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="products-section">
        <div className="container">
          <div className="products-header">
            <h2>{selectedCategory === 'all' ? t.title : selectedCategory}</h2>
            <p>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found</p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <i className="ri-search-eye-line"></i>
              <h3>{t.noProducts}</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => {
                const imageUrl = getImageUrl(product);
                return (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      {imageUrl ? (
                        <img src={imageUrl} alt={product.name} />
                      ) : (
                        <div className="no-image"><i className="ri-image-line"></i></div>
                      )}
                      {product.stock > 0 && product.stock < 20 && (
                        <span className="stock-badge low-stock">{product.stock} left</span>
                      )}
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      {product.seller && <p className="product-seller">{product.seller}</p>}
                      <div className="product-price">{t.price} {product.price}</div>
                      <div className="product-stock">
                        {product.stock > 0 ? t.inStock : t.outOfStock}
                      </div>
                      <button 
                        className="add-to-cart-btn" 
                        onClick={() => handleAddToCart(product)} 
                        disabled={product.stock === 0}
                      >
                        <i className="ri-shopping-cart-line"></i> {t.addToCart}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
