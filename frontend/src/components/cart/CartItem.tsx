import React from 'react';
import type { CartItem as CartItemType } from '../../types/cart';
import { toKebabCase } from '../../utils/kebabCase';
import { getUnitPrice } from '../../types/cart';

interface Props {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
}

const CartItem: React.FC<Props> = ({ item, onIncrease, onDecrease }) => {
  const price = getUnitPrice(item.product);
  const mainImage = item.product.gallery[0];

  return (
    <div className="cart-item">
      {/* LEFT COLUMN – name, price, attributes */}
      <div className="cart-item-info">
        <div className="cart-item-name">{item.product.name}</div>

        {price && (
          <div className="cart-item-price">
            {price.currencySymbol}
            {price.amount.toFixed(2)}
          </div>
        )}

        {item.product.attributes.map((attr) => (
          <div
            key={attr.id}
            className="cart-item-attribute-set"
            data-testid={`cart-item-attribute-${toKebabCase(attr.name)}`}
          >
            <div className="cart-item-attribute-name">
              {attr.name}:
            </div>

            <div className="cart-item-attribute-options">
              {attr.items.map((opt) => {
                const isSelected = item.selectedAttributes.some(
                  (sel) => sel.name === attr.name && sel.value === opt.value,
                );

                const base =
                  attr.type === 'swatch'
                    ? 'cart-attribute-swatch'
                    : 'cart-attribute-text';

                const className = `${base} ${
                  isSelected ? 'cart-attribute-selected' : ''
                }`;

                const baseTestId = `cart-item-attribute-${toKebabCase(
                  attr.name,
                )}-${toKebabCase(opt.value)}`;
                const selectedSuffix = isSelected ? '-selected' : '';

                return (
                  <div
                    key={opt.id}
                    className={className}
                    data-testid={`${baseTestId}${selectedSuffix}`}
                    style={
                      attr.type === 'swatch'
                        ? { backgroundColor: opt.value }
                        : undefined
                    }
                  >
                    {attr.type === 'text' ? opt.value : ''}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE COLUMN – vertical + 1 - controls */}
      <div className="cart-item-qty">
        <button
          type="button"
          className="qty-btn"
          onClick={onIncrease}
          data-testid="cart-item-amount-increase"
        >
          +
        </button>

        <div className="qty-value" data-testid="cart-item-amount">
          {item.quantity}
        </div>

        <button
          type="button"
          className="qty-btn"
          onClick={onDecrease}
          data-testid="cart-item-amount-decrease"
        >
          -
        </button>
      </div>

      {/* RIGHT COLUMN – image */}
      <div className="cart-item-image-wrapper">
        {mainImage && (
          <img
            src={mainImage}
            alt={item.product.name}
            className="cart-item-image"
          />
        )}
      </div>
    </div>
  );
};

export default CartItem;
