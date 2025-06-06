import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de instalar: npm install jwt-decode

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                email,
                password
            });

            const { access: token } = response.data;
            localStorage.setItem('token', token);

            // Obtener datos del usuario (incluyendo el rol)
            const userResponse = await axios.get('http://localhost:8000/api/users/me/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userData = {
                ...userResponse.data,
                token,
                role: userResponse.data.role
            };

            setUser(userData); // Actualiza el estado global

            // Devuelve el rol para usar en la redirección
            return {
                success: true,
                role: userData.role
            };

        } catch (error) {
            return {
                success: false,
                error: error.response ? .data ? .detail || 'Credenciales inválidas'
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
                error: error.response ? .data || 'Error en el registro'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    // Añade esto al value de tu AuthContext
    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user ? .token,
        isTeacher: user ? .role === 'teacher',
        isStudent: user ? .role === 'student',
        isAdmin: user ? .role === 'admin'
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