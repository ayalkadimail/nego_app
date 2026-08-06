import { useState, useEffect, useCallback } from 'react';
import { getFournisseur } from '../../../api/referentiel';

export function useFournisseurDetail(id) {
  const [fournisseur, setFournisseur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFournisseur = useCallback(() => {
    setLoading(true);
    setError(null);
    getFournisseur(id)
      .then(setFournisseur)
      .catch((err) => setError(err.response?.data?.detail || 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchFournisseur();
  }, [fetchFournisseur]);

  return { fournisseur, loading, error, refetch: fetchFournisseur };
}