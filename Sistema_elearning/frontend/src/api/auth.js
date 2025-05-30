// src/api/auth.js
import api from './config';

export const login = async (email, password) => {
  const response = await api.post('/users/login/', { email, password });
  return {
    token: response.data.token,
    userData: response.data.user // Asegúrate que el backend devuelva esto
  };
};

export const register = async (userData) => {
  const response = await api.post('/users/register/', userData);
  return response.data;
};