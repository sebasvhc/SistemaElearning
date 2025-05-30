import { createContext, useState, useEffect, useContext } from 'react'; // Asegúrate de importar useContext
import { login, register } from '../api/auth';

// 1. Crear contexto
export const AuthContext = createContext();

// 2. Provider
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verificar token con backend (ejemplo)
          // const userData = await verifyToken(token);
          setUser({ token });
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
      const { token, userData } = await apiLogin(email, password);
      localStorage.setItem('token', token);
      setUser({ ...userData, token });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error en login' };
    }
  };

  const register = async (userData) => {
    try {
      const { token } = await apiRegister(userData);
      localStorage.setItem('token', token);
      setUser({ token });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error en registro' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user?.token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. Hook personalizado (¡Esto es lo que faltaba!)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

