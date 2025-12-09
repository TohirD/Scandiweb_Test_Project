import type { Product, Price } from './product';

export interface SelectedAttribute {
  name: string;
  value: string;
}

/**
 * One line in the cart.
 * `id` is a stable key built from productId + selected attributes.
 */
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedAttributes: SelectedAttribute[];
}

export interface CartState {
  items: CartItem[];
}

/** Useful computed values for UI (not stored in state directly) */
export interface CartTotals {
  totalQuantity: number;
  totalAmount: number;
  currencyLabel: string | null;
  currencySymbol: string | null;
}

/**
 * Helper for computing price per item in a specific currency.
 * (We’ll usually pick the first price from backend.)
 */
export function getUnitPrice(
  product: Product,
  preferredCurrencyLabel?: string
): Price | null {
  if (!product.prices.length) {
    return null;
  }

  if (preferredCurrencyLabel) {
    const match = product.prices.find(
      (p) => p.currencyLabel === preferredCurrencyLabel
    );
    if (match) return match;
  }

  // fallback: first price
  return product.prices[0];
}
