import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('membre');
      const path = window.location.pathname;
      if (!path.startsWith('/connexion') && !path.startsWith('/inscription')) {
        window.location.href = '/connexion';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
