import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../main';
import { useCart } from '../../main';
import getImageUrl from '../../utils/imageHelper';
import './Products.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

function Products() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/public-products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
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
      noProducts: 'No products found'
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
      noProducts: 'ምንም ምርቶች አልተገኙም'
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
    return <div className="products-loading"><i className="ri-loader-4-line ri-spin"></i><p>Loading...</p></div>;
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
              <button key={category} className={`category-card ${selectedCategory === category ? 'active' : ''}`} onClick={() => setSelectedCategory(category)}>
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

          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <i className="ri-search-eye-line"></i>
              <h3>{t.noProducts}</h3>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => {
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
                      <div className="product-price">{t.price} {product.price}</div>
                      <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>
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
