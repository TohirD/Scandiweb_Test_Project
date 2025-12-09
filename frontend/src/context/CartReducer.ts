import type { CartItem, CartState, SelectedAttribute } from '../types/cart';
import type { Product } from '../types/product';

export const CART_STORAGE_KEY = 'scandiweb_cart_state_v1';

export const initialCartState: CartState = {
  items: [],
};

export type CartAction =
  | {
      type: 'ADD_ITEM';
      payload: {
        product: Product;
        selectedAttributes: SelectedAttribute[];
        quantity?: number;
      };
    }
  | {
      type: 'REMOVE_ITEM';
      payload: { cartItemId: string };
    }
  | {
      type: 'INCREASE_QUANTITY';
      payload: { cartItemId: string };
    }
  | {
      type: 'DECREASE_QUANTITY';
      payload: { cartItemId: string };
    }
  | {
      type: 'SET_QUANTITY';
      payload: { cartItemId: string; quantity: number };
    }
  | {
      type: 'CLEAR_CART';
    };


export function buildCartItemId(
  productId: string,
  selectedAttributes: SelectedAttribute[]
): string {
  const sorted = [...selectedAttributes].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const attrPart = sorted.map((a) => `${a.name}=${a.value}`).join('|');
  return `${productId}__${attrPart}`;
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, selectedAttributes, quantity = 1 } = action.payload;
      const id = buildCartItemId(product.id, selectedAttributes);

      const existingIndex = state.items.findIndex((item) => item.id === id);

      if (existingIndex !== -1) {
        const items = [...state.items];
        const existing = items[existingIndex];
        items[existingIndex] = {
          ...existing,
          quantity: existing.quantity + quantity,
        };
        return { ...state, items };
      }

      const newItem: CartItem = {
        id,
        product,
        quantity,
        selectedAttributes,
      };

      return { ...state, items: [...state.items, newItem] };
    }

    case 'REMOVE_ITEM': {
      const { cartItemId } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== cartItemId),
      };
    }

    case 'INCREASE_QUANTITY': {
      const { cartItemId } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }

    case 'DECREASE_QUANTITY': {
      const { cartItemId } = action.payload;
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === cartItemId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    }

    case 'SET_QUANTITY': {
      const { cartItemId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== cartItemId),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        ),
      };
    }

    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }

    default:
      return state;
  }
}


export function loadCartStateFromStorage(): CartState {
  if (typeof window === 'undefined') {
    return initialCartState;
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return initialCartState;

    const parsed = JSON.parse(raw) as CartState;
    if (!parsed || !Array.isArray(parsed.items)) return initialCartState;

    return parsed;
  } catch {
    return initialCartState;
  }
}


export function persistCartState(state: CartState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
  }
}
