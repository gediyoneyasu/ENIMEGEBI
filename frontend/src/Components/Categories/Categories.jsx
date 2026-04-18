import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../main'
import './Categories.css';

function Categories() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const translations = {
    en: {
      title: 'Shop by Category',
      mainTitle: 'Explore Our',
      mainTitleSpan: 'Categories',
      products: 'Products',
      localFarmers: 'Local Farmers',
      explore: 'Explore',
      loading: 'Loading categories...'
    },
    am: {
      title: 'በምድብ ይግዙ',
      mainTitle: 'የእኛን ይመልከቱ',
      mainTitleSpan: 'ምድቦች',
      products: 'ምርቶች',
      localFarmers: 'የአካባቢ ገበሬዎች',
      explore: 'ያስሱ',
      loading: 'ምድቦችን በማጫን ላይ...'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/admin/public-products');
      const products = response.data;
      
      const categoryMap = new Map();
      products.forEach(product => {
        if (!categoryMap.has(product.category)) {
          categoryMap.set(product.category, {
            id: product.category,
            name: product.category,
            nameAm: getAmharicName(product.category),
            count: 0,
            image: product.imageUrl || product.image || getCategoryImage(product.category),
            description: language === 'en' 
              ? `Fresh organic ${product.category.toLowerCase()} products from Ethiopian farmers`
              : `ትኩስ ኦርጋኒክ ${getAmharicName(product.category).toLowerCase()} ምርቶች ከኢትዮጵያ ገበሬዎች`
          });
        }
        categoryMap.get(product.category).count++;
      });
      
      if (categoryMap.size === 0) {
        setCategories(defaultCategories);
      } else {
        setCategories(Array.from(categoryMap.values()));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  const getAmharicName = (category) => {
    const names = {
      'Coffee': 'ቡና',
      'Grains': 'እህል',
      'Honey': 'ማር',
      'Dairy': 'ወተት',
      'Fruits': 'ፍራፍሬ',
      'Vegetables': 'አትክልት',
      'Spices': 'ቅመም',
      'Beverages': 'መጠጥ'
    };
    return names[category] || category;
  };

  const getCategoryImage = (category) => {
    const images = {
      'Coffee': 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500',
      'Grains': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500',
      'Honey': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
      'Dairy': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500',
      'Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500',
      'Vegetables': 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500',
      'Spices': 'https://images.unsplash.com/photo-1532335693593-41c48d1ad3ab?w=500',
      'Beverages': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500'
    };
    return images[category] || '';
  };

  const defaultCategories = [
    { id: 1, name: "Coffee", nameAm: "ቡና", count: 12, image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500", description: "Premium Ethiopian coffee beans, fresh and aromatic" },
    { id: 2, name: "Grains", nameAm: "እህል", count: 8, image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500", description: "Organic teff, wheat, barley and more" },
    { id: 3, name: "Honey", nameAm: "ማር", count: 5, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500", description: "Pure natural honey from Ethiopian highlands" },
    { id: 4, name: "Dairy", nameAm: "ወተት", count: 6, image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500", description: "Fresh milk, cheese, and yogurt products" },
    { id: 5, name: "Fruits", nameAm: "ፍራፍሬ", count: 10, image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500", description: "Fresh seasonal fruits from local farms" },
    { id: 6, name: "Vegetables", nameAm: "አትክልት", count: 15, image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500", description: "Organic vegetables delivered fresh daily" },
    { id: 7, name: "Spices", nameAm: "ቅመም", count: 7, image: "https://images.unsplash.com/photo-1532335693593-41c48d1ad3ab?w=500", description: "Traditional Ethiopian spices and seasonings" },
    { id: 8, name: "Beverages", nameAm: "መጠጥ", count: 4, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500", description: "Fresh juices and traditional drinks" }
  ];

  if (loading) {
    return (
      <div className="categories-loading">
        <i className="ri-loader-4-line ri-spin"></i>
        <p>{t.loading}</p>
      </div>
    );
  }

  return (
    <div className='categories_container' id="categories">
      <small className='categories_title'>{t.title}</small>
      <h2 className='section_title'>{t.mainTitle} <span>{t.mainTitleSpan}</span></h2>
      
      <div className="categories_cards">
        {categories.map((category) => (
          <div className="category_card" key={category.id}>
            <div className="card_front" style={{ backgroundImage: `url(${category.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <span className="category_badge">{category.count} {t.products}</span>
              <button>{language === 'en' ? category.name : category.nameAm}</button>
            </div>

            <div className="card_back" style={{ backgroundImage: `url(${category.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="price"><span>{language === 'en' ? category.name : category.nameAm}</span></div>
              <div className="card_content">
                <h3>{language === 'en' ? category.name : category.nameAm}</h3>
                <p>{language === 'en' ? category.nameAm : category.name}</p>
                <div className="category_stats">
                  <span><i className="ri-shopping-bag-line"></i> {category.count} {t.products}</span>
                  <span><i className="ri-user-line"></i> {t.localFarmers}</span>
                </div>
                <p className="category_description">{category.description}</p>
              </div>
              <div className="explore_now">
                <Link to={`/products?category=${category.name}`}>{t.explore} {language === 'en' ? category.name : category.nameAm}<i className="ri-arrow-right-line"></i></Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
