import axios from 'axios';
import { useAdminAuthStore } from '../store/adminAuthStore';

// Determine base URL (assuming backend runs on 3000 locally or via env)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = useAdminAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Auto-refresh token logic (simplified placeholder)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Here you would call refresh token endpoint
      // const newToken = await refreshToken();
      // useAdminAuthStore.getState().login(user, newToken);
      // return adminApi(originalRequest);
      
      // For now, just logout
      useAdminAuthStore.getState().logout();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminApi;
