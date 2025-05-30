// src/api/config.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Ajusta si es necesario

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token JWT a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Redirigir a login si el token expira
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;