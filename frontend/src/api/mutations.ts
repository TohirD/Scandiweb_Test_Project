import type { SelectedAttribute } from '../types/cart';

export const CREATE_ORDER = /* GraphQL */ `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      createdAt
      items {
        id
        productId
        quantity
        attributes {
          name
          value
        }
      }
    }
  }
`;

/**
 * TS mirror of backend input & output types
 */

export interface SelectedAttributeInput {
  name: string;
  value: string;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  selectedAttributes?: SelectedAttributeInput[];
}

export interface CreateOrderInput {
  items: OrderItemInput[];
}

export interface CreateOrderVariables {
  input: CreateOrderInput;
}

export interface OrderItemOutput {
  id: number | null;
  productId: string;
  quantity: number;
  attributes: SelectedAttribute[];
}

export interface OrderOutput {
  id: number;
  createdAt: string;
  items: OrderItemOutput[];
}

export interface CreateOrderData {
  createOrder: OrderOutput;
}
