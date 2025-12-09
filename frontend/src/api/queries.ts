import type { Category } from '../types/category';
import type { Product } from '../types/product';

/**
 * === GraphQL Query Strings ===
 */

export const GET_CATEGORIES = /* GraphQL */ `
  query GetCategories {
    categories {
      id
      name
      type
    }
  }
`;

export const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts($category: String) {
    products(category: $category) {
      id
      name
      inStock
      description
      category
      brand
      type
      gallery
      attributes {
        id
        productId
        name
        type
        items {
          id
          displayValue
          value
        }
      }
      prices {
        amount
        currencyLabel
        currencySymbol
      }
    }
  }
`;

export const GET_PRODUCT = /* GraphQL */ `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      inStock
      description
      category
      brand
      type
      gallery
      attributes {
        id
        productId
        name
        type
        items {
          id
          displayValue
          value
        }
      }
      prices {
        amount
        currencyLabel
        currencySymbol
      }
    }
  }
`;

/**
 * === TypeScript types for responses/variables ===
 */

export interface GetCategoriesData {
  categories: Category[];
}

export interface GetProductsVariables {
  category?: string | null;
}

export interface GetProductsData {
  products: Product[];
}

export interface GetProductVariables {
  id: string;
}

export interface GetProductData {
  product: Product | null;
}
