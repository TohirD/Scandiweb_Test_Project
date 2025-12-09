export type AttributeType = 'text' | 'swatch';

export interface AttributeItem {
  id: string;
  displayValue: string;
  value: string;
}

export interface AttributeSet {
  id: number;
  productId: string;
  name: string;
  type: AttributeType;
  items: AttributeItem[];
}

export interface Price {
  amount: number;
  currencyLabel: string;
  currencySymbol: string;
}

export interface Product {
  id: string;
  name: string;
  inStock: boolean;
  description?: string | null;
  category?: string | null;
  brand?: string | null;
  type: string;
  gallery: string[];
  attributes: AttributeSet[];
  prices: Price[];
}
