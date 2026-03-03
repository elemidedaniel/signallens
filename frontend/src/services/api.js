import axios from 'axios';

// Base URL for all API calls
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Automatically attach JWT token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// User endpoints
export const getProfile = () => API.get('/user/profile');
export const updateProfile = (data) => API.put('/user/profile', data);
export const addToWatchlist = (data) => API.post('/user/watchlist', data);
export const removeFromWatchlist = (coinId) => API.delete(`/user/watchlist/${coinId}`);

// Alerts
export const createAlert = (alertData) => API.post('/alerts', alertData);
export const getAlerts = () => API.get('/alerts');
export const deleteAlert = (id) => API.delete(`/alerts/${id}`);
export const toggleAlert = (id) => API.put(`/alerts/${id}/toggle`);
// AI Analysis
export const analyzeCoins = (coin, question) => API.post('/ai/analyze', { coin, question });

// Portfolio
export const getPortfolio = () => API.get('/portfolio');
export const addHolding = (data) => API.post('/portfolio/holding', data);
export const removeHolding = (coinId) => API.delete(`/portfolio/holding/${coinId}`);