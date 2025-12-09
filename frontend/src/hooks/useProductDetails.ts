import { useEffect, useState } from 'react';
import { graphqlRequest } from '../api/graphqlClient';
import {
  GET_PRODUCT,
  type GetProductData,
  type GetProductVariables,
} from '../api/queries';
import type { Product } from '../types/product';

export function useProductDetails(id?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let canceled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await graphqlRequest<GetProductData, GetProductVariables>({
          query: GET_PRODUCT,
          variables: { id: id! },
        });

        if (!canceled) {
          setProduct(data.product);
        }
      } catch (e) {
        if (!canceled) {
          setError((e as Error).message);
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      canceled = true;
    };
  }, [id]);

  return { product, loading, error };
}
