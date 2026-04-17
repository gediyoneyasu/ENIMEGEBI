import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Categories.css';

function Categories() {
  const { language } = useLanguage();  // Use context instead of local state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock products data
    const mockProducts = [
      { id: 1, name: 'Organic Coffee', nameAm: 'ኦርጋኒክ ቡና', price: 350, category: 'coffee', image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300', rating: 4.8, seller: 'Sidama Farmers' },
      { id: 2, name: 'Fresh Avocado', nameAm: 'ትኩስ አቮካዶ', price: 120, category: 'fruits', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300', rating: 4.9, seller: 'Oromia Organic' },
      { id: 3, name: 'Raw Honey', nameAm: 'ጥሬ ማር', price: 250, category: 'honey', image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=300', rating: 4.7, seller: 'Tigray Honey' },
      { id: 4, name: 'Fresh Milk', nameAm: 'ትኩስ ወተት', price: 80, category: 'dairy', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300', rating: 4.8, seller: 'Debre Zeit Dairy' },
      { id: 5, name: 'Tomatoes', nameAm: 'ቲማቲም', price: 60, category: 'vegetables', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa2e5?w=300', rating: 4.6, seller: 'Awasa Farms' },
      { id: 6, name: 'Ethiopian Cheese', nameAm: 'አይብ', price: 180, category: 'dairy', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300', rating: 4.7, seller: 'Debre Berhan Dairy' },
      { id: 7, name: 'Mango', nameAm: 'ማንጎ', price: 90, category: 'fruits', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300', rating: 4.9, seller: 'Arba Minch Fruits' },
      { id: 8, name: 'Cabbage', nameAm: 'ጎመን', price: 40, category: 'vegetables', image: 'https://images.unsplash.com/photo-1592417817098-5fd2cf5b35bd?w=300', rating: 4.5, seller: 'Meki Farms' }
    ];
    
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const translations = {
    en: {
      title: 'Shop by Category',
      subtitle: 'Browse our products by category',
      coffee: 'Coffee',
      dairy: 'Dairy',
      fruits: 'Fruits',
      vegetables: 'Vegetables',
      honey: 'Honey',
      meat: 'Meat',
      viewProducts: 'View Products',
      products: 'products',
      price: 'ETB',
      addToCart: 'Add to Cart',
      viewAll: 'View All Products',
      backToCategories: 'Back to Categories'
    },
    am: {
      title: 'በምድብ ይግዙ',
      subtitle: 'ምርቶቻችንን በምድብ ይመልከቱ',
      coffee: 'ቡና',
      dairy: 'ወተት',
      fruits: 'ፍራፍሬ',
      vegetables: 'አትክልት',
      honey: 'ማር',
      meat: 'ሥጋ',
      viewProducts: 'ምርቶችን ይመልከቱ',
      products: 'ምርቶች',
      price: 'ብር',
      addToCart: 'ወደ ጋሪ ጨምር',
      viewAll: 'ሁሉንም ምርቶች ይመልከቱ',
      backToCategories: 'ወደ ምድቦች ተመለስ'
    }
  };

  const t = translations[language];

  const categories = [
    { id: 'coffee', name: t.coffee, icon: 'ri-cup-line', color: '#6F4E37', bgColor: '#6F4E3710', productCount: 12, image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400' },
    { id: 'dairy', name: t.dairy, icon: 'ri-drinks-line', color: '#2196F3', bgColor: '#2196F310', productCount: 8, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' },
    { id: 'fruits', name: t.fruits, icon: 'ri-apple-line', color: '#FF6B6B', bgColor: '#FF6B6B10', productCount: 15, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400' },
    { id: 'vegetables', name: t.vegetables, icon: 'ri-leaf-line', color: '#4CAF50', bgColor: '#4CAF5010', productCount: 20, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa2e5?w=400' },
    { id: 'honey', name: t.honey, icon: 'ri-drop-line', color: '#FFC107', bgColor: '#FFC10710', productCount: 6, image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=400' }
  ];

  const categoryProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : [];

  const getCategoryInfo = () => {
    return categories.find(c => c.id === selectedCategory);
  };

  if (loading) {
    return (
      <div className="categories-loading">
        <i className="ri-loader-4-line ri-spin"></i>
        <p>Loading categories...</p>
      </div>
    );
  }

  if (selectedCategory) {
    const category = getCategoryInfo();
    return (
      <div className="category-products-page">
        <div className="category-products-container">
          <button className="back-btn" onClick={() => setSelectedCategory(null)}>
            <i className="ri-arrow-left-line"></i> {t.backToCategories}
          </button>
          
          <div className="category-hero" style={{ background: `linear-gradient(135deg, ${category?.color}20, ${category?.color}05)` }}>
            <div className="category-hero-icon" style={{ color: category?.color }}>
              <i className={category?.icon}></i>
            </div>
            <h1>{category?.name}</h1>
            <p>{categoryProducts.length} {t.products}</p>
          </div>

          <div className="category-products-grid">
            {categoryProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={language === 'en' ? product.name : product.nameAm} />
                </div>
                <div className="product-info">
                  <h3>{language === 'en' ? product.name : product.nameAm}</h3>
                  <p className="product-seller">{product.seller}</p>
                  <div className="product-rating">
                    <i className="ri-star-fill"></i> {product.rating}
                  </div>
                  <div className="product-price">
                    {t.price} {product.price}
                  </div>
                  <button className="add-to-cart-btn">
                    <i className="ri-shopping-cart-line"></i> {t.addToCart}
                  </button>
                </div>
              </div>
            ))}
          </div>
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

        <div className="categories-grid">
          {categories.map(category => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="category-card-image">
                <img src={category.image} alt={category.name} />
                <div className="category-card-overlay">
                  <div className="category-icon" style={{ color: category.color }}>
                    <i className={category.icon}></i>
                  </div>
                  <h3>{category.name}</h3>
                  <p>{category.productCount} {t.products}</p>
                  <button className="view-btn">{t.viewProducts}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-categories">
          <Link to="/products" className="view-all-btn">
            {t.viewAll} <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Categories;