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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/admin/public-products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Our Products',
      subtitle: 'Fresh, organic, and locally sourced products',
      search: 'Search products...',
      allCategories: 'All Products',
      categories: { coffee: 'Coffee', dairy: 'Dairy', fruits: 'Fruits', vegetables: 'Vegetables', honey: 'Honey' },
      price: 'ETB',
      addToCart: 'Add to Cart',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      addedToCart: 'Added to cart!',
      sortBy: 'Sort by',
      priceLowHigh: 'Price: Low to High',
      priceHighLow: 'Price: High to Low',
      rating: 'Rating',
      viewDetails: 'View Details',
      perKg: '/kg',
      perLiter: '/liter',
      unit: 'unit'
    },
    am: {
      title: 'ምርቶቻችን',
      subtitle: 'ትኩስ፣ ኦርጋኒክ እና በአገር ውስጥ የሚገኙ ምርቶች',
      search: 'ምርቶችን ይፈልጉ...',
      allCategories: 'ሁሉም ምርቶች',
      categories: { coffee: 'ቡና', dairy: 'ወተት', fruits: 'ፍራፍሬ', vegetables: 'አትክልት', honey: 'ማር' },
      price: 'ብር',
      addToCart: 'ወደ ጋሪ ጨምር',
      inStock: 'ክምችት አለ',
      outOfStock: 'ክምችት የለም',
      addedToCart: 'ወደ ጋሪ ተጨምሯል!',
      sortBy: 'ደርድር በ',
      priceLowHigh: 'ዋጋ ከዝቅተኛ ወደ ከፍተኛ',
      priceHighLow: 'ዋጋ ከከፍተኛ ወደ ዝቅተኛ',
      rating: 'ከፍተኛ ደረጃ',
      viewDetails: 'ዝርዝር ይመልከቱ',
      perKg: '/ኪግ',
      perLiter: '/ሊትር',
      unit: 'ክፍል'
    }
  };

  const t = translations[language];

  const categories = [
    { id: 'all', name: t.allCategories, icon: 'ri-apps-line' },
    { id: 'coffee', name: t.categories.coffee, icon: 'ri-cup-line' },
    { id: 'dairy', name: t.categories.dairy, icon: 'ri-drinks-line' },
    { id: 'fruits', name: t.categories.fruits, icon: 'ri-apple-line' },
    { id: 'vegetables', name: t.categories.vegetables, icon: 'ri-leaf-line' },
    { id: 'honey', name: t.categories.honey, icon: 'ri-drop-line' }
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${language === 'en' ? product.name : product.nameAm || product.name} ${t.addedToCart}`);
  };

  const getUnitLabel = (unit) => {
    if (unit === 'kg') return t.perKg;
    if (unit === 'liter') return t.perLiter;
    return `/${t.unit}`;
  };

  const getImageUrl = (product) => {
    if (product.imageUrl) return product.imageUrl;
    if (product.image) return `http://localhost:5001${product.image}`;
    return null;
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const productName = language === 'en' ? product.name : (product.nameAm || product.name);
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.seller || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && product.status === 'active';
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
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <i className={category.icon}></i>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="products-section">
        <div className="container">
          <div className="products-header">
            <h2>
              {selectedCategory === 'all' ? t.title : 
               categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p>{filteredProducts.length} {language === 'en' ? 'products found' : 'ምርቶች ተገኝተዋል'}</p>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => {
              const imageUrl = getImageUrl(product);
              return (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={language === 'en' ? product.name : (product.nameAm || product.name)} />
                    ) : (
                      <div className="no-image">
                        <i className="ri-image-line"></i>
                      </div>
                    )}
                    {product.stock < 20 && product.stock > 0 && (
                      <span className="stock-badge low-stock">{product.stock} left</span>
                    )}
                    {product.stock === 0 && (
                      <span className="stock-badge out-of-stock">Out of Stock</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{language === 'en' ? product.name : (product.nameAm || product.name)}</h3>
                    {product.seller && (
                      <p className="product-seller">
                        <i className="ri-store-line"></i> {product.seller}
                      </p>
                    )}
                    <div className="product-stats">
                      {product.rating > 0 && (
                        <span className="product-rating">
                          <i className="ri-star-fill"></i> {product.rating}
                        </span>
                      )}
                      <span className="product-stock">
                        <i className="ri-stock-line"></i> 
                        {product.stock > 0 ? t.inStock : t.outOfStock}
                      </span>
                    </div>
                    <div className="product-price">
                      <span className="price">{t.price} {product.price}</span>
                      <span className="price-unit">{getUnitLabel(product.unit)}</span>
                    </div>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <i className="ri-shopping-cart-line"></i>
                      {t.addToCart}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-results">
              <i className="ri-search-eye-line"></i>
              <h3>{language === 'en' ? 'No products found' : 'ምንም ምርቶች አልተገኙም'}</h3>
              <p>{language === 'en' ? 'Try adjusting your search or filter criteria' : 'እባክዎ ፍለጋዎን ወይም ማጣሪያዎን ያስተካክሉ'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
