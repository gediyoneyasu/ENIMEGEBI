import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch products
      const productsRes = await axios.get(`${API_URL}/api/admin/public-products`);
      setProducts(productsRes.data);
      
      // Extract unique categories from products
      const uniqueCategories = [...new Map(productsRes.data.map(p => [p.category, {
        name: p.category,
        count: productsRes.data.filter(prod => prod.category === p.category).length,
        image: p.image || p.imageUrl
      }])).values()];
      
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
    if (!imagePath.startsWith('/uploads')) return `${API_URL}/uploads/${imagePath}`;
    return `${API_URL}${imagePath}`;
  };

  const getProductsByCategory = (categoryName) => {
    return products.filter(p => p.category === categoryName && p.status === 'active');
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
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
      outOfStock: 'Out of Stock'
    },
    am: {
      title: 'በምድብ ይግዙ',
      subtitle: 'ምርቶችን በምድብ ይመልከቱ',
      backToCategories: 'ወደ ምድቦች ተመለስ',
      products: 'ምርቶች',
      price: 'ብር',
      addToCart: 'ወደ ጋሪ ጨምር',
      inStock: 'ክምችት አለ',
      outOfStock: 'ክምችት የለም'
    }
  };

  const t = translations[language];

  // If a category is selected, show products for that category
  if (selectedCategory) {
    const categoryProducts = getProductsByCategory(selectedCategory.name);
    
    return (
      <div className="categories-products-page">
        <div className="categories-products-header">
          <button className="back-btn" onClick={() => setSelectedCategory(null)}>
            <i className="ri-arrow-left-line"></i> {t.backToCategories}
          </button>
          <h1>{selectedCategory.name}</h1>
          <p>{categoryProducts.length} {t.products}</p>
        </div>

        <div className="products-grid-category">
          {categoryProducts.map(product => {
            const imageUrl = getImageUrl(product.image || product.imageUrl);
            return (
              <div key={product._id} className="product-card-category">
                <div className="product-image-category">
                  {imageUrl ? (
                    <img src={imageUrl} alt={product.name} />
                  ) : (
                    <div className="no-image"><i className="ri-image-line"></i></div>
                  )}
                </div>
                <div className="product-info-category">
                  <h3>{language === 'en' ? product.name : (product.nameAm || product.name)}</h3>
                  <div className="product-price-category">{t.price} {product.price}</div>
                  <div className="product-stock-category">
                    {product.stock > 0 ? t.inStock : t.outOfStock}
                  </div>
                  <button 
                    className="add-to-cart-btn-category" 
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
          <div className="no-products-category">
            <i className="ri-shopping-bag-line"></i>
            <p>No products found in this category</p>
          </div>
        )}
      </div>
    );
  }

  // Show all categories (flip card view)
  if (loading) return <div className="loading-spinner"><i className="ri-loader-4-line ri-spin"></i><p>Loading...</p></div>;

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      <div className="categories-grid-main">
        {categories.map((category) => (
          <div className="category-card-main" key={category.name} onClick={() => setSelectedCategory(category)}>
            <div className="card-front-main" style={{ backgroundImage: `url(${getImageUrl(category.image)})` }}>
              <span className="category-badge-main">{category.count} Products</span>
              <div className="category-icon-main">
                <i className="ri-apps-line"></i>
              </div>
              <button>{category.name}</button>
            </div>
            <div className="card-back-main">
              <div className="price-main">{category.name}</div>
              <div className="card-content-main">
                <h3>{category.name}</h3>
                <div className="category-stats-main">
                  <span><i className="ri-shopping-bag-line"></i> {category.count} Products</span>
                </div>
                <p>Click to view all {category.name} products</p>
              </div>
              <div className="explore-main">
                <span>Explore <i className="ri-arrow-right-line"></i></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
