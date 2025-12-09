import type { Product, Price } from './product';

export interface SelectedAttribute {
  name: string;
  value: string;
}


export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedAttributes: SelectedAttribute[];
}

export interface CartState {
  items: CartItem[];
}

export interface CartTotals {
  totalQuantity: number;
  totalAmount: number;
  currencyLabel: string | null;
  currencySymbol: string | null;
}


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

  return product.prices[0];
}
