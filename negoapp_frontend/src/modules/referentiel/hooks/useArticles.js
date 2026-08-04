import { useState, useEffect, useCallback } from 'react';
import { getArticles } from '../../../api/referentiel';

export function useArticles(filters) {
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = useCallback(() => {
    setLoading(true);
    setError(null);
    getArticles(filters)
      .then(setData)
      .catch((err) => setError(err.message || 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { data, loading, error, refetch: fetchArticles };
}