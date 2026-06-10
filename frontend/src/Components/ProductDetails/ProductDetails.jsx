import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage, useCart } from '../../main';
import './ProductDetails.css';
import { getImageUrl, getProductImages } from '../../utils/imageHelper';
import { fetchProductById } from '../../utils/productApi';

const PLACEHOLDER = 'https://via.placeholder.com/600x600?text=No+Image';

function ProductDetails() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [wishlist, setWishlist] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const imageRef = useRef(null);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setProduct(null);
      setRelatedProducts([]);
      const data = await fetchProductById(id);
      setProduct(data.product || null);
      setRelatedProducts(data.related || []);

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

  const productImages = product ? getProductImages(product, PLACEHOLDER) : [];

  const totalImages = productImages.length;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % totalImages);
  };

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleMouseMove = (e) => {
    if (!isZooming) return;
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
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

  const discount = product ? Math.floor(Math.random() * 30) + 10 : 0;
  const originalPrice = product ? Math.floor(product.price * (1 + discount / 100)) : 0;
  const avgRating = 4.5;
  const totalReviews = 128;

  const t = {
    en: {
      price: 'ETB',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      quantity: 'Quantity',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      description: 'Product Description',
      specifications: 'Specifications',
      reviews: 'Customer Reviews',
      relatedProducts: 'Related Products',
      freeShipping: 'Free Shipping',
      deliveryText: 'Free delivery within 3-5 business days',
      returns: '30 Days Returns',
      returnsText: 'Easy returns within 30 days',
      warranty: '1 Year warranty',
      color: 'Color',
      size: 'Size',
      seller: 'Seller',
      of: 'of'
    },
    am: {
      price: 'ብር',
      inStock: 'ክምችት አለ',
      outOfStock: 'ክምችት የለም',
      quantity: 'ብዛት',
      addToCart: 'ወደ ጋሪ ጨምር',
      buyNow: 'አሁን ግዛ',
      description: 'የምርት መግለጫ',
      specifications: 'ዝርዝር መረጃ',
      reviews: 'የደንበኞች አስተያየት',
      relatedProducts: 'ተዛማጅ ምርቶች',
      freeShipping: 'ነጻ አቅርቦት',
      deliveryText: 'ከ3-5 የስራ ቀናት ውስጥ ነጻ አቅርቦት',
      returns: 'በ30 ቀናት ውስጥ መመለስ',
      returnsText: 'በ30 ቀናት ውስጥ ቀላል የመመለስ አገልግሎት',
      warranty: 'የ1 አመት ዋስትና',
      color: 'ቀለም',
      size: 'መጠን',
      seller: 'ሻጭ',
      of: 'ከ'
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

  return (
    <div className="pd-page">
      <div className="pd-container">
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link>
          <i className="ri-arrow-right-s-line"></i>
          <Link to="/products">Products</Link>
          <i className="ri-arrow-right-s-line"></i>
          <span>{product.category}</span>
          <i className="ri-arrow-right-s-line"></i>
          <span className="active">{product.name}</span>
        </div>

        <div className="pd-main">
          <div className="pd-gallery">
            <div className="pd-main-image-container">
              <div 
                className={`pd-main-image ${isZooming ? 'zooming' : ''}`}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
              >
                <img 
                  src={productImages[currentImageIndex]} 
                  alt={product.name}
                  onClick={() => openLightbox(currentImageIndex)}
                />
                {isZooming && (
                  <div 
                    className="pd-zoom-lens"
                    style={{
                      backgroundImage: `url(${productImages[currentImageIndex]})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundSize: '200%'
                    }}
                  />
                )}
              </div>
              
              <div className="pd-image-counter">
                <span>{currentImageIndex + 1} / {totalImages}</span>
              </div>
              
              {totalImages > 1 && (
                <>
                  <button className="pd-nav-arrow prev" onClick={prevImage}>
                    <i className="ri-arrow-left-s-line"></i>
                  </button>
                  <button className="pd-nav-arrow next" onClick={nextImage}>
                    <i className="ri-arrow-right-s-line"></i>
                  </button>
                </>
              )}
            </div>
            
            <div className="pd-thumbnails">
              {productImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`pd-thumb ${currentImageIndex === idx ? 'active' : ''}`}
                  onClick={() => goToImage(idx)}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} />
                  <span className="pd-thumb-number">{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pd-info">
            <h1 className="pd-title">{product.name}</h1>
            
            <div className="pd-rating-section">
              <div className="pd-stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={i < Math.floor(avgRating) ? 'ri-star-fill' : 'ri-star-line'}></i>
                ))}
              </div>
              <span className="pd-rating-count">{avgRating} ({totalReviews} reviews)</span>
              <span className="pd-sold-count">🔥 {Math.floor(Math.random() * 5000)}+ sold</span>
            </div>

            <div className="pd-price-section">
              <span className="pd-current-price">{t.price} {product.price.toLocaleString()}</span>
              <span className="pd-original-price">{t.price} {originalPrice.toLocaleString()}</span>
              <span className="pd-discount-badge">-{discount}%</span>
            </div>

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
                </div>
              </div>
            </div>

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

            <div className="pd-actions">
              <button className="pd-add-to-cart" onClick={handleAddToCart}>
                <i className="ri-shopping-cart-line"></i> {t.addToCart}
              </button>
              <button className="pd-buy-now" onClick={handleBuyNow}>
                {t.buyNow}
              </button>
              <button className={`pd-wishlist ${wishlist ? 'active' : ''}`} onClick={() => setWishlist(!wishlist)}>
                <i className={wishlist ? 'ri-heart-fill' : 'ri-heart-line'}></i>
              </button>
              <button className="pd-share" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }}>
                <i className="ri-share-line"></i>
              </button>
            </div>

            <div className="pd-seller-info">
              <div className="pd-seller-header">
                <i className="ri-store-line"></i>
                <strong>{t.seller}: E-MARKATO Official Store</strong>
              </div>
            </div>
          </div>
        </div>

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
                <p>{product.description || `Experience the best quality with ${product.name}. This premium product is designed to meet your needs with exceptional performance and durability.`}</p>
                <h4>Key Features:</h4>
                <ul>
                  <li>✓ Premium quality materials</li>
                  <li>✓ 1 year warranty included</li>
                  <li>✓ Free shipping across Ethiopia</li>
                  <li>✓ 30-day money-back guarantee</li>
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
                    <tr><td>Delivery Time</td><td>3-5 Business Days</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="pd-reviews">
                {reviews.map(review => (
                  <div key={review.id} className="pd-review-card">
                    <img src={review.avatar} alt={review.name} />
                    <div className="pd-review-content">
                      <h4>{review.name}</h4>
                      <div className="pd-review-stars">
                        {[...Array(5)].map((_, i) => <i key={i} className={i < review.rating ? 'ri-star-fill' : 'ri-star-line'}></i>)}
                      </div>
                      <p>{review.comment}</p>
                      <span className="pd-review-date">{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="pd-related">
            <h2>{t.relatedProducts}</h2>
            <div className="pd-related-grid">
              {relatedProducts.map(related => (
                <Link to={`/product/${related._id}`} key={related._id} className="pd-related-card">
                  <img src={getImageUrl(related.images?.[0] || related.image || related.imageUrl, PLACEHOLDER)} alt={related.name} />
                  <h3>{related.name}</h3>
                  <div className="pd-related-price">{t.price} {related.price.toLocaleString()}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {showLightbox && (
        <div className="pd-lightbox" onClick={closeLightbox}>
          <button className="pd-lightbox-close" onClick={closeLightbox}>
            <i className="ri-close-line"></i>
          </button>
          <button className="pd-lightbox-prev" onClick={(e) => { e.stopPropagation(); prevLightbox(); }}>
            <i className="ri-arrow-left-s-line"></i>
          </button>
          <div className="pd-lightbox-image" onClick={(e) => e.stopPropagation()}>
            <img src={productImages[lightboxIndex]} alt={product.name} />
            <div className="pd-lightbox-counter">
              {lightboxIndex + 1} {t.of} {totalImages}
            </div>
          </div>
          <button className="pd-lightbox-next" onClick={(e) => { e.stopPropagation(); nextLightbox(); }}>
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
