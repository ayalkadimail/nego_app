import api from './axios';

// ---- Articles ----

export function getArticles(params = {}) {
  return api.get('articles/', { params }).then((res) => res.data);
}

export function getArticle(id) {
  return api.get(`articles/${id}/`).then((res) => res.data);
}

export function createArticle(data) {
  return api.post('articles/', data).then((res) => res.data);
}

export function updateArticle(id, data) {
  return api.put(`articles/${id}/`, data).then((res) => res.data);
}

export function deleteArticle(id) {
  return api.delete(`articles/${id}/`);
}

export function previewImportArticles(fichier) {
  const form = new FormData();
  form.append('fichier', fichier);
  return api.post('articles/import/preview/', form).then((res) => res.data);
}

export function confirmImportArticles(fichier) {
  const form = new FormData();
  form.append('fichier', fichier);
  return api.post('articles/import/confirm/', form).then((res) => res.data);
}

// ---- Fournisseurs ----

export function getFournisseurs(params = {}) {
  return api.get('fournisseurs/', { params }).then((res) => res.data);
}

export function getFournisseur(id) {
  return api.get(`fournisseurs/${id}/`).then((res) => res.data);
}

export function createFournisseur(data) {
  return api.post('fournisseurs/', data).then((res) => res.data);
}

export function updateFournisseur(id, data) {
  return api.patch(`fournisseurs/${id}/`, data).then((res) => res.data);
}

export function deleteFournisseur(id) {
  return api.delete(`fournisseurs/${id}/`);
}

export function previewImportFournisseurs(fichier) {
  const form = new FormData();
  form.append('fichier', fichier);
  return api.post('fournisseurs/import/preview/', form).then((res) => res.data);
}

export function confirmImportFournisseurs(fichier) {
  const form = new FormData();
  form.append('fichier', fichier);
  return api.post('fournisseurs/import/confirm/', form).then((res) => res.data);
}

// ---- MpnQualifie ----

export function getMpnQualifies(articleId) {
  return api.get('mpn-qualifies/', { params: { article: articleId } }).then((res) => res.data);
}

export function createMpnQualifie(data) {
  return api.post('mpn-qualifies/', data).then((res) => res.data);
}