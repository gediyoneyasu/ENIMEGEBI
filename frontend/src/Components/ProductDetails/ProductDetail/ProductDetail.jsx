import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage, useCart } from '../../main';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './ProductDetail.css';

const API_URL = 'http://localhost:5001';

function ProductDetail() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/public-products`);
      
      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data && response.data.products) {
        productsData = response.data.products;
      }
      
      const foundProduct = productsData.find(p => p._id === id);
      setProduct(foundProduct);
      
      // Get related products (same category)
      if (foundProduct) {
        const related = productsData.filter(p => p.category === foundProduct.category && p._id !== id).slice(0, 6);
        setRelatedProducts(related);
      }
      
      // Sample reviews
      setReviews([
        { id: 1, name: 'John D.', rating: 5, date: '2024-05-15', comment: 'Excellent product! Very satisfied with quality.', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { id: 2, name: 'Sarah M.', rating: 4, date: '2024-05-10', comment: 'Good product, fast delivery.', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
        { id: 3, name: 'Mike R.', rating: 5, date: '2024-05-05', comment: 'Best purchase ever! Highly recommend.', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' }
      ]);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600x600?text=Product+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
    return `${API_URL}/uploads/${imagePath}`;
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    const productWithQuantity = { ...product, quantity };
    addToCart(productWithQuantity);
    alert(`Added ${quantity} x ${product?.name} to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleWishlist = () => {
    setWishlist(!wishlist);
    alert(wishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Product link copied to clipboard!');
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const discount = product ? Math.floor(Math.random() * 30) + 10 : 0;
  const originalPrice = product ? Math.floor(product.price * (1 + discount / 100)) : 0;
  const avgRating = 4.5;
  const totalReviews = 128;

  const t = {
    en: {
      price: 'ETB',
      originalPrice: 'Original Price',
      discount: 'Discount',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      quantity: 'Quantity',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      addToWishlist: 'Add to Wishlist',
      share: 'Share',
      description: 'Product Description',
      specifications: 'Specifications',
      reviews: 'Customer Reviews',
      relatedProducts: 'Related Products',
      freeShipping: 'Free Shipping',
      deliveryEstimate: 'Delivery Estimate',
      deliveryText: 'Free delivery within 3-5 business days',
      returns: '30 Days Returns',
      returnsText: 'Easy returns within 30 days',
      warranty: 'Warranty',
      warrantyText: '1 Year warranty included',
      securePayment: 'Secure Payment',
      rating: 'Rating',
      writeReview: 'Write a Review',
      seeAllReviews: 'See All Reviews',
      color: 'Color',
      size: 'Size',
      seller: 'Seller',
      sellerRating: 'Seller Rating',
      responseRate: 'Response Rate',
      responseTime: 'Response Time'
    },
    am: {
      price: 'ብር',
      originalPrice: 'ዋና ዋጋ',
      discount: 'ቅናሽ',
      inStock: 'ክምችት አለ',
      outOfStock: 'ክምችት የለም',
      quantity: 'ብዛት',
      addToCart: 'ወደ ጋሪ ጨምር',
      buyNow: 'አሁን ግዛ',
      addToWishlist: 'ወደ ምኞት ዝርዝር ጨምር',
      share: 'አጋራ',
      description: 'የምርት መግለጫ',
      specifications: 'ዝርዝር መረጃ',
      reviews: 'የደንበኞች አስተያየት',
      relatedProducts: 'ተዛማጅ ምርቶች',
      freeShipping: 'ነጻ አቅርቦት',
      deliveryEstimate: 'የአቅርቦት ግምት',
      deliveryText: 'ከ3-5 የስራ ቀናት ውስጥ ነጻ አቅርቦት',
      returns: 'በ30 ቀናት ውስጥ መመለስ',
      returnsText: 'በ30 ቀናት ውስጥ ቀላል የመመለስ አገልግሎት',
      warranty: 'ዋስትና',
      warrantyText: 'የ1 አመት ዋስትና',
      securePayment: 'ደህንነቱ የተጠበቀ ክፍያ',
      rating: 'ደረጃ',
      writeReview: 'አስተያየት ጻፍ',
      seeAllReviews: 'ሁሉንም አስተያየቶች ተመልከት',
      color: 'ቀለም',
      size: 'መጠን',
      seller: 'ሻጭ',
      sellerRating: 'የሻጭ ደረጃ',
      responseRate: 'የምላሽ መጠን',
      responseTime: 'የምላሽ ጊዜ'
    }
  }[language];

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-not-found">
        <i className="ri-error-warning-line"></i>
        <h2>Product Not Found</h2>
        <Link to="/products" className="pd-back-btn">Back to Products</Link>
      </div>
    );
  }

  const productImages = [
    getImageUrl(product.image || product.imageUrl),
    ...(product.images || [])
  ].slice(0, 5);

  return (
    <div className="pd-page">
      <div className="pd-container">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link>
          <i className="ri-arrow-right-s-line"></i>
          <Link to="/products">Products</Link>
          <i className="ri-arrow-right-s-line"></i>
          <span>{product.category}</span>
          <i className="ri-arrow-right-s-line"></i>
          <span className="active">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="pd-main">
          {/* Image Gallery - Left */}
          <div className="pd-gallery">
            <div className="pd-main-image">
              <img 
                src={productImages[selectedImage]} 
                alt={product.name}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
              />
              {showZoom && (
                <div 
                  className="pd-zoom-lens"
                  style={{
                    backgroundImage: `url(${productImages[selectedImage]})`,
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundSize: '200%'
                  }}
                />
              )}
            </div>
            <div className="pd-thumbnails">
              {productImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`pd-thumb ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info - Right */}
          <div className="pd-info">
            <h1 className="pd-title">{product.name}</h1>
            
            {/* Rating */}
            <div className="pd-rating-section">
              <div className="pd-stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={i < Math.floor(avgRating) ? 'ri-star-fill' : 'ri-star-line'}></i>
                ))}
              </div>
              <span className="pd-rating-count">{avgRating} ({totalReviews} reviews)</span>
              <span className="pd-sold-count">🔥 {Math.floor(Math.random() * 5000)}+ sold</span>
            </div>

            {/* Price */}
            <div className="pd-price-section">
              <span className="pd-current-price">{t.price} {product.price.toLocaleString()}</span>
              <span className="pd-original-price">{t.price} {originalPrice.toLocaleString()}</span>
              <span className="pd-discount-badge">-{discount}%</span>
            </div>

            {/* Shipping Info */}
            <div className="pd-shipping-info">
              <div className="pd-shipping-item">
                <i className="ri-truck-line"></i>
                <div>
                  <strong>{t.freeShipping}</strong>
                  <span>{t.deliveryText}</span>
                </div>
              </div>
              <div className="pd-shipping-item">
                <i className="ri-refund-line"></i>
                <div>
                  <strong>{t.returns}</strong>
                  <span>{t.returnsText}</span>
                </div>
              </div>
              <div className="pd-shipping-item">
                <i className="ri-shield-check-line"></i>
                <div>
                  <strong>{t.warranty}</strong>
                  <span>{t.warrantyText}</span>
                </div>
              </div>
            </div>

            {/* Color Options */}
            <div className="pd-options">
              <div className="pd-option-group">
                <label>{t.color}:</label>
                <div className="pd-color-options">
                  {['Black', 'White', 'Blue', 'Red'].map(color => (
                    <button 
                      key={color}
                      className={`pd-color-btn ${selectedColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Size Options */}
              <div className="pd-option-group">
                <label>{t.size}:</label>
                <div className="pd-size-options">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button 
                      key={size}
                      className={`pd-size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="pd-option-group">
                <label>{t.quantity}:</label>
                <div className="pd-quantity">
                  <button onClick={() => handleQuantityChange('decrease')}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange('increase')}>+</button>
                  <span className="pd-stock">{product.stock > 0 ? t.inStock : t.outOfStock}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pd-actions">
              <button className="pd-add-to-cart" onClick={handleAddToCart}>
                <i className="ri-shopping-cart-line"></i> {t.addToCart}
              </button>
              <button className="pd-buy-now" onClick={handleBuyNow}>
                {t.buyNow}
              </button>
              <button className={`pd-wishlist ${wishlist ? 'active' : ''}`} onClick={handleWishlist}>
                <i className={wishlist ? 'ri-heart-fill' : 'ri-heart-line'}></i>
              </button>
              <button className="pd-share" onClick={handleShare}>
                <i className="ri-share-line"></i>
              </button>
            </div>

            {/* Seller Info */}
            <div className="pd-seller-info">
              <div className="pd-seller-header">
                <i className="ri-store-line"></i>
                <strong>{t.seller}: E-MARKATO Official Store</strong>
              </div>
              <div className="pd-seller-stats">
                <span>⭐ {t.sellerRating}: 4.9</span>
                <span>💬 {t.responseRate}: 98%</span>
                <span>⏱️ {t.responseTime}: Within 1 hour</span>
              </div>
            </div>

            {/* Payment Badges */}
            <div className="pd-payment-badges">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png" alt="PayPal" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1280px-American_Express_logo_%282018%29.svg.png" alt="Amex" />
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="pd-tabs">
          <div className="pd-tab-headers">
            <button className={activeTab === 'description' ? 'active' : ''} onClick={() => setActiveTab('description')}>
              {t.description}
            </button>
            <button className={activeTab === 'specifications' ? 'active' : ''} onClick={() => setActiveTab('specifications')}>
              {t.specifications}
            </button>
            <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>
              {t.reviews} ({reviews.length})
            </button>
          </div>

          <div className="pd-tab-content">
            {activeTab === 'description' && (
              <div className="pd-description">
                <p>{product.description || `Experience the best quality with ${product.name}. This premium product is designed to meet your needs with exceptional performance and durability. Made with high-quality materials, it ensures long-lasting use and satisfaction. Perfect for daily use, this product combines style, functionality, and reliability.`}</p>
                <h4>Key Features:</h4>
                <ul>
                  <li>✓ Premium quality materials</li>
                  <li>✓ 1 year warranty included</li>
                  <li>✓ Free shipping across Ethiopia</li>
                  <li>✓ 30-day money-back guarantee</li>
                  <li>✓ 24/7 customer support</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="pd-specifications">
                <table>
                  <tbody>
                    <tr><td>Product Name</td><td>{product.name}</td></tr>
                    <tr><td>Category</td><td>{product.category}</td></tr>
                    <tr><td>Price</td><td>{t.price} {product.price}</td></tr>
                    <tr><td>Stock Status</td><td>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</td></tr>
                    <tr><td>Warranty</td><td>1 Year</td></tr>
                    <tr><td>Return Policy</td><td>30 Days</td></tr>
                    <tr><td>Delivery Time</td><td>3-5 Business Days</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="pd-reviews">
                <div className="pd-reviews-summary">
                  <div className="pd-avg-rating">
                    <span className="pd-avg-number">{avgRating}</span>
                    <div className="pd-avg-stars">{[...Array(5)].map((_, i) => <i key={i} className={i < Math.floor(avgRating) ? 'ri-star-fill' : 'ri-star-line'}></i>)}</div>
                    <span>Based on {totalReviews} reviews</span>
                  </div>
                  <button className="pd-write-review">{t.writeReview}</button>
                </div>
                {reviews.map(review => (
                  <div key={review.id} className="pd-review-card">
                    <img src={review.avatar} alt={review.name} />
                    <div className="pd-review-content">
                      <h4>{review.name}</h4>
                      <div className="pd-review-stars">{[...Array(5)].map((_, i) => <i key={i} className={i < review.rating ? 'ri-star-fill' : 'ri-star-line'}></i>)}</div>
                      <p>{review.comment}</p>
                      <span className="pd-review-date">{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pd-related">
            <h2>{t.relatedProducts}</h2>
            <div className="pd-related-grid">
              {relatedProducts.map(related => (
                <Link to={`/product/${related._id}`} key={related._id} className="pd-related-card">
                  <img src={getImageUrl(related.image || related.imageUrl)} alt={related.name} />
                  <h3>{related.name}</h3>
                  <div className="pd-related-price">{t.price} {related.price.toLocaleString()}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
