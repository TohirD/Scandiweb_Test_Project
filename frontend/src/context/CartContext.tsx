import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { CartItem, CartState, SelectedAttribute } from '../types/cart';
import type { Product } from '../types/product';
import {
  cartReducer,
  initialCartState,
  loadCartStateFromStorage,
  persistCartState,
  type CartAction,
} from './CartReducer';
import { getUnitPrice } from '../types/cart';

interface CartContextValue {
  state: CartState;
  items: CartItem[];
  dispatch: React.Dispatch<CartAction>;

  addToCart: (
    product: Product,
    selectedAttributes: SelectedAttribute[],
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  increaseQuantity: (cartItemId: string) => void;
  decreaseQuantity: (cartItemId: string) => void;
  clearCart: () => void;

  totalQuantity: number;
  totalAmount: number;
  currencyLabel: string | null;
  currencySymbol: string | null;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialCartState,
    () => loadCartStateFromStorage() 
  );

  useEffect(() => {
    persistCartState(state);
  }, [state]);

  const { totalQuantity, totalAmount, currencyLabel, currencySymbol } =
    useMemo(() => {
      if (state.items.length === 0) {
        return {
          totalQuantity: 0,
          totalAmount: 0,
          currencyLabel: null,
          currencySymbol: null,
        };
      }

      let totalQuantity = 0;
      let totalAmount = 0;
      let currencyLabel: string | null = null;
      let currencySymbol: string | null = null;

      for (const item of state.items) {
        totalQuantity += item.quantity;

        const price = getUnitPrice(item.product);
        if (price) {
          totalAmount += price.amount * item.quantity;
          currencyLabel ??= price.currencyLabel;
          currencySymbol ??= price.currencySymbol;
        }
      }

      return { totalQuantity, totalAmount, currencyLabel, currencySymbol };
    }, [state.items]);

  const api = useMemo<CartContextValue>(
    () => ({
      state,
      items: state.items,
      dispatch,
      addToCart: (product, selectedAttributes, quantity = 1) => {
        dispatch({
          type: 'ADD_ITEM',
          payload: { product, selectedAttributes, quantity },
        });
      },
      removeFromCart: (cartItemId) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { cartItemId } });
      },
      increaseQuantity: (cartItemId) => {
        dispatch({ type: 'INCREASE_QUANTITY', payload: { cartItemId } });
      },
      decreaseQuantity: (cartItemId) => {
        dispatch({ type: 'DECREASE_QUANTITY', payload: { cartItemId } });
      },
      clearCart: () => {
        dispatch({ type: 'CLEAR_CART' });
      },
      totalQuantity,
      totalAmount,
      currencyLabel,
      currencySymbol,
    }),
    [state, totalQuantity, totalAmount, currencyLabel, currencySymbol]
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
