import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../main';
import './Categories.css';

const API_URL = 'http://localhost:5001';

const Categories = () => {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all products
      const response = await axios.get(`${API_URL}/api/admin/public-products`);
      
      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data && response.data.products) {
        productsData = response.data.products;
      } else if (response.data && response.data.data) {
        productsData = response.data.data;
      }
      
      setAllProducts(productsData);
      
      // Extract unique categories from products
      const categoryMap = new Map();
      
      productsData.forEach(product => {
        if (product && product.category) {
          const catName = product.category.toUpperCase();
          if (!categoryMap.has(catName)) {
            categoryMap.set(catName, {
              name: catName,
              count: 1,
              icon: getCategoryIcon(catName),
              color: getCategoryColor(catName)
            });
          } else {
            const existing = categoryMap.get(catName);
            existing.count += 1;
          }
        }
      });
      
      // If no categories from products, use static categories
      if (categoryMap.size === 0) {
        const staticCategories = [
          { name: 'ELECTRONICS', count: 0, icon: 'ri-smartphone-line', color: '#FF6B00' },
          { name: 'FASHION', count: 0, icon: 'ri-shirt-line', color: '#E74C3C' },
          { name: 'HOME & KITCHEN', count: 0, icon: 'ri-home-smile-line', color: '#2ECC71' },
          { name: 'BOOKS', count: 0, icon: 'ri-book-open-line', color: '#9B59B6' },
          { name: 'GROCERIES', count: 0, icon: 'ri-shopping-basket-line', color: '#3498DB' },
          { name: 'AGRICULTURAL', count: 0, icon: 'ri-seedling-line', color: '#27AE60' },
          { name: 'BUSINESS', count: 0, icon: 'ri-briefcase-line', color: '#F39C12' },
          { name: 'DELIVERY', count: 0, icon: 'ri-truck-line', color: '#1ABC9C' }
        ];
        setCategories(staticCategories);
        setError('No products found. Add products to see categories.');
      } else {
        setCategories(Array.from(categoryMap.values()));
      }
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
      // Set static categories as fallback
      setCategories([
        { name: 'ELECTRONICS', count: 0, icon: 'ri-smartphone-line', color: '#FF6B00' },
        { name: 'FASHION', count: 0, icon: 'ri-shirt-line', color: '#E74C3C' },
        { name: 'HOME & KITCHEN', count: 0, icon: 'ri-home-smile-line', color: '#2ECC71' },
        { name: 'BOOKS', count: 0, icon: 'ri-book-open-line', color: '#9B59B6' },
        { name: 'GROCERIES', count: 0, icon: 'ri-shopping-basket-line', color: '#3498DB' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'ELECTRONICS': 'ri-smartphone-line',
      'FASHION': 'ri-shirt-line',
      'HOME & KITCHEN': 'ri-home-smile-line',
      'BOOKS': 'ri-book-open-line',
      'GROCERIES': 'ri-shopping-basket-line',
      'AGRICULTURAL': 'ri-seedling-line',
      'BUSINESS': 'ri-briefcase-line',
      'DELIVERY': 'ri-truck-line'
    };
    return icons[category] || 'ri-apps-line';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'ELECTRONICS': '#FF6B00',
      'FASHION': '#E74C3C',
      'HOME & KITCHEN': '#2ECC71',
      'BOOKS': '#9B59B6',
      'GROCERIES': '#3498DB',
      'AGRICULTURAL': '#27AE60',
      'BUSINESS': '#F39C12',
      'DELIVERY': '#1ABC9C'
    };
    return colors[category] || '#FF6B00';
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x300?text=Product';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
    return `${API_URL}/uploads/${imagePath}`;
  };

  const handleCategoryClick = (categoryName) => {
    const products = allProducts.filter(p => p.category?.toUpperCase() === categoryName);
    setSelectedCategory(categoryName);
    setCategoryProducts(products);
  };

  const goBack = () => {
    setSelectedCategory(null);
    setCategoryProducts([]);
  };

  const t = {
    en: {
      title: 'Shop by Category',
      subtitle: 'Browse our products by category',
      categories: 'All Categories',
      products: 'Products',
      backToCategories: '← Back to Categories',
      noProducts: 'No products found in this category',
      price: 'ETB',
      addToCart: 'Add to Cart',
      viewAll: 'View All'
    },
    am: {
      title: 'በምድብ ይግዙ',
      subtitle: 'ምርቶችን በምድብ ይመልከቱ',
      categories: 'ሁሉም ምድቦች',
      products: 'ምርቶች',
      backToCategories: '← ወደ ምድቦች ተመለስ',
      noProducts: 'በዚህ ምድብ ውስጥ ምንም ምርቶች አልተገኙም',
      price: 'ብር',
      addToCart: 'ወደ ጋሪ ጨምር',
      viewAll: 'ሁሉንም ይመልከቱ'
    }
  }[language];

  if (loading) {
    return (
      <div className="categories-loading">
        <div className="loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  // If a category is selected, show products in that category
  if (selectedCategory) {
    return (
      <div className="categories-page">
        <div className="categories-container">
          <button className="back-btn" onClick={goBack}>
            <i className="ri-arrow-left-line"></i> {t.backToCategories}
          </button>
          
          <div className="category-header">
            <h1>{selectedCategory}</h1>
            <p>{categoryProducts.length} {t.products}</p>
          </div>
          
          {categoryProducts.length === 0 ? (
            <div className="no-products">
              <i className="ri-shopping-bag-line"></i>
              <h3>{t.noProducts}</h3>
            </div>
          ) : (
            <div className="category-products-grid">
              {categoryProducts.map(product => {
                const discount = Math.floor(Math.random() * 30) + 10;
                const originalPrice = Math.floor(product.price * (1 + discount / 100));
                const soldCount = Math.floor(Math.random() * 1000) + 10;
                
                return (
                  <div key={product._id} className="product-card">
                    <Link to={`/product/${product._id}`} className="product-link">
                      <div className="product-image">
                        <img src={getImageUrl(product.image || product.imageUrl)} alt={product.name} />
                        {discount > 15 && <span className="discount-badge">-{discount}%</span>}
                      </div>
                      <div className="product-info">
                        <h3 className="product-title">{product.name}</h3>
                        <div className="product-price">
                          <span className="current-price">{t.price} {product.price.toLocaleString()}</span>
                          <span className="original-price">{t.price} {originalPrice.toLocaleString()}</span>
                        </div>
                        <div className="product-rating">
                          <div className="stars">★★★★☆</div>
                          <span className="rating-count">({soldCount}+ sold)</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show all categories
  return (
    <div className="categories-page">
      <div className="categories-container">
        <div className="categories-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="ri-error-warning-line"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="category-card"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="category-icon" style={{ backgroundColor: category.color + '20' }}>
                <i className={category.icon} style={{ color: category.color }}></i>
              </div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-count">{category.count}+ items</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
