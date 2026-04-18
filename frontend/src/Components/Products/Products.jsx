import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import './Products.css';

function Products() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = 'http://localhost:5001';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/public-products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
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
    }
  };

  const t = translations[language];

  const categories = ['all', 'Coffee', 'Grains', 'Honey', 'Dairy', 'Fruits', 'Vegetables', 'Spices', 'Beverages'];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const productName = language === 'en' ? product.name : (product.nameAm || product.name);
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase());
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

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="products-hero-content">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="search-bar">
            <i className="ri-search-line"></i>
            <input type="text" placeholder={t.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
            <p>{filteredProducts.length} products found</p>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => {
              const imageUrl = getImageUrl(product);
              return (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} />
                    ) : (
                      <div className="no-image">
                        <i className="ri-image-line"></i>
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    {product.nameAm && <p className="product-name-am">{product.nameAm}</p>}
                    <div className="product-price">{t.price} {product.price}</div>
                    <div className="product-stock">{product.stock > 0 ? t.inStock : t.outOfStock}</div>
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>
                      <i className="ri-shopping-cart-line"></i> {t.addToCart}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-results">
              <i className="ri-search-eye-line"></i>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
