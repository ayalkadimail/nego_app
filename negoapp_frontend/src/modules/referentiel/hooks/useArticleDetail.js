import { useState, useEffect, useCallback } from 'react';
import { getArticle } from '../../../api/referentiel';

export function useArticleDetail(id) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticle = useCallback(() => {
    setLoading(true);
    setError(null);
    getArticle(id)
      .then(setArticle)
      .catch((err) => setError(err.response?.data?.detail || 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return { article, loading, error, refetch: fetchArticle };
}