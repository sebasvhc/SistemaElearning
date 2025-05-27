import api from './api';

export const login = async (credentials) => {
  try {
    const response = await api.post('/token/', credentials);
    localStorage.setItem('token', response.data.access); // Guarda el token
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};