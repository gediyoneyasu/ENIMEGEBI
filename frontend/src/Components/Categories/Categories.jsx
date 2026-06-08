import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../main';
import { useCart } from '../../main';
import './Categories.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

function Categories() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productsRes = await axios.get(`${API_URL}/api/admin/public-products`);
      const activeProducts = Array.isArray(productsRes.data)
        ? productsRes.data.filter((p) => p?.status === 'active')
        : [];
      setProducts(activeProducts);
      
      const categoryMap = new Map();
      activeProducts.forEach((p) => {
        if (!p?.category) return;
        if (!categoryMap.has(p.category)) {
          categoryMap.set(p.category, {
            name: p.category,
            count: 1,
            image: p.imageUrl || p.image || ''
          });
        } else {
          const existing = categoryMap.get(p.category);
          existing.count += 1;
          if (!existing.image) {
            existing.image = p.imageUrl || p.image || '';
          }
        }
      });
      const uniqueCategories = Array.from(categoryMap.values());
      setCategories(uniqueCategories);
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
    return `${API_URL}${imagePath}`;
  };

  const getCategoryIcon = (categoryName) => {
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
    return icons[categoryName] || 'ri-folder-line';
  };

  const getProductsByCategory = (categoryName) => {
    return products.filter(p => p.category === categoryName && p.status === 'active');
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const translations = {
    en: {
      title: 'Shop by Category',
      subtitle: 'Browse our products by category',
      backToCategories: 'Back to Categories',
      products: 'Products',
      price: 'ETB',
      addToCart: 'Add to Cart',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      explore: 'Explore',
      items: 'items'
    },
    am: {
      title: 'በምድብ ይግዙ',
      subtitle: 'ምርቶችን በምድብ ይመልከቱ',
      backToCategories: 'ወደ ምድቦች ተመለስ',
      products: 'ምርቶች',
      price: 'ብር',
      addToCart: 'ወደ ጋሪ ጨምር',
      inStock: 'ክምችት አለ',
      outOfStock: 'ክምችት የለም',
      explore: 'ያስሱ',
      items: 'ዕቃዎች'
    }
  };

  const t = translations[language];

  // Show products for selected category
  if (selectedCategory) {
    const categoryProducts = getProductsByCategory(selectedCategory.name);
    
    return (
      <div className="ae-category-products">
        <div className="ae-category-products-header">
          <button className="ae-back-btn" onClick={() => setSelectedCategory(null)}>
            <i className="ri-arrow-left-line"></i> {t.backToCategories}
          </button>
          <div className="ae-category-title-section">
            <h1>{selectedCategory.name}</h1>
            <p>{categoryProducts.length} {t.products}</p>
          </div>
        </div>

        <div className="ae-products-grid-category">
          {categoryProducts.map(product => {
            const imageUrl = getImageUrl(product.image || product.imageUrl);
            const discount = Math.floor(Math.random() * 20) + 5;
            const originalPrice = Math.floor(product.price * (1 + discount / 100));
            
            return (
              <div key={product._id} className="ae-product-card-category">
                <div className="ae-product-img-category">
                  {imageUrl ? (
                    <img src={imageUrl} alt={product.name} />
                  ) : (
                    <div className="ae-no-image"><i className="ri-image-line"></i></div>
                  )}
                  {discount > 10 && (
                    <span className="ae-discount-tag">-{discount}%</span>
                  )}
                </div>
                <div className="ae-product-info-category">
                  <h3>{language === 'en' ? product.name : (product.nameAm || product.name)}</h3>
                  <div className="ae-price-row">
                    <span className="ae-current-price">{t.price} {product.price}</span>
                    <span className="ae-old-price">{t.price} {originalPrice}</span>
                  </div>
                  <div className="ae-stock-status">
                    {product.stock > 0 ? (
                      <span className="ae-in-stock"><i className="ri-checkbox-circle-line"></i> {t.inStock}</span>
                    ) : (
                      <span className="ae-out-stock"><i className="ri-close-circle-line"></i> {t.outOfStock}</span>
                    )}
                  </div>
                  <button 
                    className="ae-add-cart-btn" 
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

        {categoryProducts.length === 0 && (
          <div className="ae-no-products">
            <i className="ri-shopping-bag-line"></i>
            <p>No products found in this category</p>
          </div>
        )}
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="ae-loading-categories">
        <div className="ae-loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  // Show all categories (main view)
  return (
    <div className="ae-categories-page">
      <div className="ae-categories-container">
        <div className="ae-categories-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="ae-categories-grid">
          {categories.map((category) => (
            <div className="ae-category-flip-card" key={category.name} onClick={() => setSelectedCategory(category)}>
              <div className="ae-flip-card-inner">
                {/* Front Side */}
                <div className="ae-flip-front" style={{ backgroundImage: `url(${getImageUrl(category.image)})` }}>
                  <div className="ae-front-overlay"></div>
                  <div className="ae-front-content">
                    <div className="ae-category-icon-front">
                      <i className={getCategoryIcon(category.name)}></i>
                    </div>
                    <div className="ae-category-name-front">{category.name}</div>
                    <div className="ae-category-count-front">{category.count} {t.items}</div>
                    <button className="ae-explore-front">{t.explore} →</button>
                  </div>
                </div>
                
                {/* Back Side */}
                <div className="ae-flip-back">
                  <div className="ae-back-content">
                    <div className="ae-back-icon">
                      <i className={getCategoryIcon(category.name)}></i>
                    </div>
                    <h3>{category.name}</h3>
                    <div className="ae-back-stats">
                      <span><i className="ri-shopping-bag-line"></i> {category.count} {t.products}</span>
                    </div>
                    <p>Click to explore all {category.name.toLowerCase()} products</p>
                    <div className="ae-back-explore">
                      {t.explore} <i className="ri-arrow-right-line"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;