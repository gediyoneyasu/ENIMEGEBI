import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../main';
import './Categories.css';
import { getImageUrl, getProductImage } from '../../utils/imageHelper';
import { fetchAllProducts } from '../../utils/productApi';
const PLACEHOLDER = 'https://via.placeholder.com/300x300?text=Product';

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
      
      const productsData = await fetchAllProducts();
      setAllProducts(productsData);
      
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
                        <img 
                          src={getImageUrl(getProductImage(product), PLACEHOLDER)} 
                          alt={product.name}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=Product'; }}
                          loading="lazy"
                        />
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
