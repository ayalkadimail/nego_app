import api from './axios';

export const getOffres = (params = {}) => api.get('offres/', { params }).then(r => r.data);
export const getOffre = (id) => api.get(`offres/${id}/`).then(r => r.data);
export const createOffre = (data) => api.post('offres/', data).then(r => r.data);
export const updateOffre = (id, data) => api.patch(`offres/${id}/`, data).then(r => r.data);
export const previewImportOffres = (fichier, fournisseur) => {
  const form = new FormData(); form.append('fichier', fichier); if (fournisseur) form.append('fournisseur', fournisseur);
  return api.post('offres/import/preview/', form).then(r => r.data);
};
export const confirmImportOffres = (fichier, fournisseur) => {
  const form = new FormData(); form.append('fichier', fichier); if (fournisseur) form.append('fournisseur', fournisseur);
  return api.post('offres/import/confirm/', form).then(r => r.data);
};
