import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../main';
import { useCart } from '../../main';
import './ProductDetails.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

function ProductDetails() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/public-products`);
      let allProducts = [];
      if (response.data.success) {
        allProducts = response.data.products || [];
      } else {
        allProducts = response.data;
      }
      if (!Array.isArray(allProducts)) allProducts = [];
      
      const foundProduct = allProducts.find(p => p._id === id || p.id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        const related = allProducts
          .filter(p => p.category === foundProduct.category && (p._id !== id && p.id !== id))
          .slice(0, 4);
        setRelatedProducts(related);
      }
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
    return `${API_URL}/uploads/${imagePath}`;
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    navigate('/checkout');
  };

  const renderStars = (rating = 4.5) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="ri-star-fill"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="ri-star-half-fill"></i>);
      } else {
        stars.push(<i key={i} className="ri-star-line"></i>);
      }
    }
    return stars;
  };

  const translations = {
    en: {
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      freeShipping: 'Free Shipping',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      quantity: 'Quantity',
      description: 'Product Details',
      specifications: 'Specifications',
      reviews: 'Customer Reviews',
      shipping: 'Shipping & Returns',
      relatedProducts: 'You May Also Like',
      securePayment: 'Secure Payment',
      daysReturns: '30-Day Returns',
      ordersOver: 'On orders over ETB 1000',
      easyReturns: 'Easy returns within 30 days'
    },
    am: {
      addToCart: 'ወደ ጋሪ ጨምር',
      buyNow: 'አሁን ግዛ',
      freeShipping: 'ነጻ አቅርቦት',
      inStock: 'ክምችት አለ',
      outOfStock: 'ክምችት የለም',
      quantity: 'ብዛት',
      description: 'የምርት ዝርዝር',
      specifications: 'ዝርዝር መረጃ',
      reviews: 'የደንበኛ አስተያየቶች',
      shipping: 'አቅርቦት እና መመለስ',
      relatedProducts: 'ሊወዷቸው የሚችሉ',
      securePayment: 'ደህንነቱ የተጠበቀ ክፍያ',
      daysReturns: 'በ30 ቀናት ውስጥ መመለስ',
      ordersOver: 'ከ1000 ብር በላይ ትዕዛዝ',
      easyReturns: 'በ30 ቀናት ውስጥ ቀላል መመለስ'
    }
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="ae-pd-loading">
        <div className="ae-pd-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="ae-pd-notfound">
        <i className="ri-error-warning-line"></i>
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/products" className="ae-pd-back">Back to Shop</Link>
      </div>
    );
  }

  const discount = product.discount || Math.floor(Math.random() * 20) + 5;
  const originalPrice = product.price * (1 + discount / 100);
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 500) + 50;
  const images = [product.imageUrl || product.image].filter(Boolean);

  return (
    <div className="ae-product-detail">
      <div className="ae-pd-container">
        {/* Breadcrumb */}
        <div className="ae-pd-breadcrumb">
          <Link to="/">Home</Link>
          <i className="ri-arrow-right-s-line"></i>
          <Link to="/products">Products</Link>
          <i className="ri-arrow-right-s-line"></i>
          <span>{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="ae-pd-main">
          {/* Left - Image Gallery */}
          <div className="ae-pd-gallery">
            <div className="ae-pd-main-img">
              <img src={getImageUrl(images[selectedImage])} alt={product.name} />
              {discount > 10 && <span className="ae-pd-discount">-{discount}%</span>}
            </div>
            {images.length > 1 && (
              <div className="ae-pd-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`ae-pd-thumb ${selectedImage === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={getImageUrl(img)} alt={`View ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="ae-pd-info">
            <h1 className="ae-pd-name">{product.name}</h1>
            
            {/* Rating */}
            <div className="ae-pd-rating">
              <div className="ae-pd-stars">{renderStars(rating)}</div>
              <span className="ae-pd-rating-num">{rating}</span>
              <span className="ae-pd-review-count">({reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="ae-pd-price-box">
              <span className="ae-pd-current">ETB {product.price.toLocaleString()}</span>
              {discount > 0 && (
                <>
                  <span className="ae-pd-old">ETB {Math.floor(originalPrice).toLocaleString()}</span>
                  <span className="ae-pd-save">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Shipping Info */}
            <div className="ae-pd-shipping">
              <div className="ae-pd-ship-item">
                <i className="ri-truck-line"></i>
                <div>
                  <strong>{t.freeShipping}</strong>
                  <p>{t.ordersOver}</p>
                </div>
              </div>
              <div className="ae-pd-ship-item">
                <i className="ri-refund-line"></i>
                <div>
                  <strong>{t.daysReturns}</strong>
                  <p>{t.easyReturns}</p>
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="ae-pd-stock">
              <span className={`ae-pd-stock-badge ${product.stock > 0 ? 'in' : 'out'}`}>
                {product.stock > 0 ? `✓ ${t.inStock}` : `✗ ${t.outOfStock}`}
              </span>
              {product.stock > 0 && product.stock < 20 && (
                <span className="ae-pd-lowstock">Only {product.stock} left!</span>
              )}
            </div>

            {/* Quantity */}
            <div className="ae-pd-quantity">
              <span className="ae-pd-qty-label">{t.quantity}:</span>
              <div className="ae-pd-qty-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                  <i className="ri-subtract-line"></i>
                </button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))} disabled={quantity >= (product.stock || 10)}>
                  <i className="ri-add-line"></i>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="ae-pd-actions">
              <button className="ae-pd-addcart" onClick={handleAddToCart} disabled={product.stock === 0}>
                <i className="ri-shopping-cart-line"></i> {t.addToCart}
              </button>
              <button className="ae-pd-buynow" onClick={handleBuyNow} disabled={product.stock === 0}>
                {t.buyNow}
              </button>
            </div>

            {/* Payment */}
            <div className="ae-pd-payment">
              <span>{t.securePayment}:</span>
              <i className="ri-shield-check-line"></i>
              <i className="ri-bank-card-line"></i>
              <i className="ri-smartphone-line"></i>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="ae-pd-tabs">
          <div className="ae-pd-tab-headers">
            <button className={`ae-pd-tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>
              {t.description}
            </button>
            <button className={`ae-pd-tab ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>
              {t.specifications}
            </button>
            <button className={`ae-pd-tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
              {t.reviews} ({reviewCount})
            </button>
            <button className={`ae-pd-tab ${activeTab === 'shipping' ? 'active' : ''}`} onClick={() => setActiveTab('shipping')}>
              {t.shipping}
            </button>
          </div>

          <div className="ae-pd-tab-content">
            {activeTab === 'description' && (
              <div className="ae-pd-desc">
                <p>{product.description || `Experience premium quality with ${product.name}. This product is carefully selected to meet your needs and expectations.`}</p>
                <ul>
                  <li>✓ Premium quality guaranteed</li>
                  <li>✓ Authentic product from trusted sellers</li>
                  <li>✓ Fast delivery across Ethiopia</li>
                  <li>✓ 24/7 customer support</li>
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="ae-pd-specs">
                <table>
                  <tbody>
                    <tr><td>Product Name</td><td>{product.name}</td></tr>
                    <tr><td>Category</td><td>{product.category}</td></tr>
                    <tr><td>Price</td><td>ETB {product.price.toLocaleString()}</td></tr>
                    <tr><td>Stock</td><td>{product.stock > 0 ? `${product.stock} units` : 'Out of stock'}</td></tr>
                    <tr><td>Condition</td><td>New</td></tr>
                    <tr><td>Warranty</td><td>1 Year Limited</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="ae-pd-reviews">
                <div className="ae-pd-review-summary">
                  <div className="ae-pd-review-score">
                    <span className="ae-pd-score">{rating}</span>
                    <div className="ae-pd-review-stars">{renderStars(rating)}</div>
                    <span>Based on {reviewCount} reviews</span>
                  </div>
                  <div className="ae-pd-review-bars">
                    {[5,4,3,2,1].map(star => (
                      <div key={star} className="ae-pd-bar-item">
                        <span>{star} ★</span>
                        <div className="ae-pd-bar-bg">
                          <div className="ae-pd-bar-fill" style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }}></div>
                        </div>
                        <span>{star === 5 ? '70%' : star === 4 ? '20%' : '5%'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="ae-pd-review-list">
                  <div className="ae-pd-review-item">
                    <div className="ae-pd-reviewer">
                      <i className="ri-user-circle-line"></i>
                      <div>
                        <strong>Abebe B.</strong>
                        <div className="ae-pd-review-stars">{renderStars(5)}</div>
                      </div>
                    </div>
                    <p>Excellent product! Fast delivery and great quality. Will definitely buy again.</p>
                    <span className="ae-pd-review-date">2 days ago</span>
                  </div>
                  <div className="ae-pd-review-item">
                    <div className="ae-pd-reviewer">
                      <i className="ri-user-circle-line"></i>
                      <div>
                        <strong>Tigist M.</strong>
                        <div className="ae-pd-review-stars">{renderStars(4)}</div>
                      </div>
                    </div>
                    <p>Good product, worth the price. Delivery was on time.</p>
                    <span className="ae-pd-review-date">1 week ago</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="ae-pd-shipping-tab">
                <h4>Shipping Information</h4>
                <p>• Free shipping on orders over ETB 1000</p>
                <p>• Delivery time: 2-5 business days within Addis Ababa</p>
                <p>• 5-10 business days for other cities in Ethiopia</p>
                <h4>Returns Policy</h4>
                <p>• 30-day easy returns</p>
                <p>• Full refund or exchange for damaged/wrong items</p>
                <p>• Contact customer support for return requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="ae-pd-related">
            <h2 className="ae-pd-related-title">{t.relatedProducts}</h2>
            <div className="ae-pd-related-grid">
              {relatedProducts.map(related => (
                <Link to={`/product/${related._id || related.id}`} key={related._id || related.id} className="ae-pd-related-card">
                  <div className="ae-pd-related-img">
                    <img src={getImageUrl(related.imageUrl || related.image)} alt={related.name} />
                  </div>
                  <h3>{related.name}</h3>
                  <div className="ae-pd-related-price">ETB {related.price?.toLocaleString()}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;