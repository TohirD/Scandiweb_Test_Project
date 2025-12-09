import { useEffect, useState } from 'react';
import { graphqlRequest } from '../api/graphqlClient';
import { GET_CATEGORIES, type GetCategoriesData } from '../api/queries';
import type { Category } from '../types/category';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await graphqlRequest<GetCategoriesData>({ query: GET_CATEGORIES });
        if (!canceled) setCategories(data.categories);
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
  }, []);

  return { categories, loading, error };
}
