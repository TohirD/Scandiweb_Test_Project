import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { graphqlRequest } from '../../api/graphqlClient';
import CartItem from './CartItem';

import {
  CREATE_ORDER,
  type CreateOrderData,
  type CreateOrderVariables,
} from '../../api/mutations';

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartOverlay: React.FC<CartOverlayProps> = ({ isOpen, onClose }) => {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalAmount,
    totalQuantity,
    currencySymbol,
  } = useCart();

  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!items.length || isPlacing) return;

    setIsPlacing(true);
    setError(null);

    const variables: CreateOrderVariables = {
      input: {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedAttributes: item.selectedAttributes.map((a) => ({
            name: a.name,
            value: a.value,
          })),
        })),
      },
    };

    try {
      await graphqlRequest<CreateOrderData, CreateOrderVariables>({
        query: CREATE_ORDER,
        variables,
      });
      clearCart();
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsPlacing(false);
    }
  };

  if (!isOpen) return null;

  const itemsLabel = totalQuantity === 1 ? '1 item' : `${totalQuantity} items`;

  return (
    <>
      <div className="cart-overlay-backdrop" onClick={onClose} />

      <aside className="cart-overlay-panel">
        <h2 className="cart-overlay-title">
          <span>My Bag, </span>
          <span className='itemm'>{itemsLabel}</span>
        </h2>

        <div className="cart-overlay-list">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={() => increaseQuantity(item.id)}
              onDecrease={() => decreaseQuantity(item.id)}
            />
          ))}
        </div>

        <div className="cart-overlay-footer">
          <div className="cart-total-row">
            <span>Total</span>
            <span data-testid="cart-total">
              {currencySymbol ?? '$'}
              {totalAmount.toFixed(2)}
            </span>
          </div>

          {error && <div className="cart-error">{error}</div>}

          <button
            type="button"
            className="place-order-btn"
            disabled={!items.length || isPlacing}
            onClick={handlePlaceOrder}
          >
            PLACE ORDER
          </button>
        </div>
      </aside>
    </>
  );
};

export default CartOverlay;

