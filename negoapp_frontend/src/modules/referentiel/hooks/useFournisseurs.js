import { useState, useEffect, useCallback } from 'react';
import { getFournisseurs } from '../../../api/referentiel';

export function useFournisseurs(filters) {
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFournisseurs = useCallback(() => {
    setLoading(true);
    setError(null);
    getFournisseurs(filters)
      .then(setData)
      .catch((err) => setError(err.message || 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchFournisseurs();
  }, [fetchFournisseurs]);

  return { data, loading, error, refetch: fetchFournisseurs };
}