import { useEffect, useState } from 'react';
import { graphqlRequest } from '../api/graphqlClient';
import {
  GET_PRODUCTS,
  type GetProductsData,
  type GetProductsVariables,
} from '../api/queries';
import type { Product } from '../types/product';

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const variables: GetProductsVariables = {};
        if (category && category !== 'all') {
          variables.category = category;
        }
        const data = await graphqlRequest<GetProductsData, GetProductsVariables>({
          query: GET_PRODUCTS,
          variables,
        });
        if (!canceled) setProducts(data.products);
      } catch (e) {
        if (!canceled) setError((e as Error).message);
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    void load();
    return () => {
      canceled = true;
    };
  }, [category]);

  return { products, loading, error };
}
