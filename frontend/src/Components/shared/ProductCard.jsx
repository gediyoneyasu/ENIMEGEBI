import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, getProductImage } from '../../utils/imageHelper';
import { getProductMeta } from '../../utils/productMeta';
import './ae-shared.css';

const PLACEHOLDER = 'https://via.placeholder.com/300x300?text=Product';

const ProductCard = memo(({
  product,
  variant = 'grid',
  onAddToCart,
  labels = {},
  showWishlist = true,
  showChoice = true
}) => {
  const [wishlisted, setWishlisted] = useState(false);
  const meta = getProductMeta(product._id);
  const originalPrice = Math.round(product.price * (1 + meta.discount / 100));
  const imgSrc = getImageUrl(getProductImage(product), PLACEHOLDER);
  const priceWhole = Math.floor(product.price || 0);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((prev) => !prev);
  };

  const handleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product, e);
  };

  return (
    <div className={`ae-card ae-card--${variant}`}>
      <Link to={`/product/${product._id}`} className="ae-card__link">
        <div className="ae-card__img-wrap">
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => { e.target.src = PLACEHOLDER; }}
          />
          <div className="ae-card__overlay" />
          {meta.discount >= 15 && (
            <span className="ae-card__discount">-{meta.discount}%</span>
          )}
          {showChoice && meta.isChoice && (
            <span className="ae-card__choice">{labels.choice || 'Choice'}</span>
          )}
          {showWishlist && (
            <button
              type="button"
              className={`ae-card__wishlist ${wishlisted ? 'active' : ''}`}
              onClick={toggleWishlist}
              aria-label="Add to wishlist"
            >
              <i className={wishlisted ? 'ri-heart-fill' : 'ri-heart-line'}></i>
            </button>
          )}
        </div>
        <div className="ae-card__body">
          <h3 className="ae-card__title">{product.name}</h3>
          <div className="ae-card__price-row">
            <span className="ae-card__price">
              <small>ETB</small> {priceWhole.toLocaleString()}
            </span>
            {(variant === 'flash' || meta.discount >= 20) && (
              <span className="ae-card__old-price">ETB {originalPrice.toLocaleString()}</span>
            )}
          </div>
          {variant === 'flash' ? (
            <div className="ae-card__progress">
              <div className="ae-card__progress-bar">
                <div className="ae-card__progress-fill" style={{ width: `${meta.progress}%` }}></div>
              </div>
              <span className="ae-card__sold">{meta.sold}+ {labels.sold || 'sold'}</span>
            </div>
          ) : (
            <>
              <div className="ae-card__rating">
                <span className="ae-card__stars">{'★'.repeat(Math.floor(meta.rating))}{'☆'.repeat(5 - Math.floor(meta.rating))}</span>
                <span className="ae-card__reviews">{meta.sold}+ {labels.sold || 'sold'}</span>
              </div>
              <div className="ae-card__shipping">
                <i className="ri-truck-line"></i> {labels.freeShipping || 'Free shipping'}
              </div>
            </>
          )}
        </div>
      </Link>
      <button type="button" className="ae-card__cart-btn" onClick={handleCart}>
        <i className="ri-shopping-cart-line"></i>
        <span>{labels.addToCart || 'Add to cart'}</span>
      </button>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
