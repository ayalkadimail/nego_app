import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('negoapp_user_id');
  if (userId) {
    config.headers['X-User-Id'] = userId;
  }
  return config;
});

export default api;