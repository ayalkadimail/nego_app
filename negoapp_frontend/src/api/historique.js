import api from './axios';

export function getHistorique(params = {}) {
  return api.get('historique/', { params }).then((res) => res.data);
}
