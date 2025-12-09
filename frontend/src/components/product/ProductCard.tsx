import React from 'react';
import type { Product } from '../../types/product';
import { toKebabCase } from '../../utils/kebabCase';

interface ProductCardProps {
  product: Product;
  onOpenDetails: () => void;
  onQuickAdd: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onQuickAdd,
}) => {
  const price = product.prices[0];

  const isOutOfStock = !product.inStock;

  return (
    <article
      className={`product-card ${isOutOfStock ? 'product-card-out' : ''}`}
      onClick={onOpenDetails}
      data-testid={`product-${toKebabCase(product.name)}`}
    >
      <div className="product-image-wrapper">
        <img
          src={product.gallery[0]}
          alt={product.name}
          className="product-image"
        />
        {isOutOfStock && (
          <div className="product-out-overlay">
            <span>OUT OF STOCK</span>
          </div>
        )}

        {!isOutOfStock && (
          <button
            type="button"
            className="quick-shop-btn"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd();
            }}
          >
            <img src="/Cart.png" alt="Cart" className="quick-shop-icon" />
          </button>
        )}
      </div>

      <div className="product-info">
        <div className="product-name">{product.name}</div>
        {price && (
          <div className="product-price">
            {price.currencySymbol}
            {price.amount.toFixed(2)}
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
