import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de instalar: npm install jwt-decode

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verificar token con backend
          const response = await axios.get('http://localhost:8000/api/users/me/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const decoded = jwtDecode(token);
          setUser({
            ...response.data,
            token,
            role: decoded.role // Asegúrate que el backend incluya el rol en el token
          });
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        email,
        password
      });
      
      const { access: token } = response.data;
      localStorage.setItem('token', token);
      
      // Obtener datos del usuario
      const userResponse = await axios.get('http://localhost:8000/api/users/me/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const decoded = jwtDecode(token);
      const userData = {
        ...userResponse.data,
        token,
        role: decoded.role
      };
      
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Credenciales inválidas' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await axios.post('http://localhost:8000/api/register/', userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Error en el registro'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user?.token,
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}