import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api'; // Usa tu instancia configurada de axios

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Función para verificar el token y cargar el usuario
    const verifyAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Verificar si el token está expirado
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    throw new Error('Token expirado');
                }

                const userResponse = await api.get('/users/me/');
                const userData = {
                    ...userResponse.data,
                    token,
                    role: userResponse.data.role
                };

                setUser(userData);
            }
        } catch (error) {
            console.error("Error verifying auth:", error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false); // ESTA LÍNEA ES CRÍTICA
        }
    };

    // Verificar autenticación al cargar
    useEffect(() => {
        verifyAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                email,
                password
            });

            const { access: token } = response.data;
            localStorage.setItem('token', token);

            await verifyAuth(); // Verificar la autenticación después del login

            return {
                success: true,
                user: user
            };

        } catch (error) {
            console.error("Error en login:", error.response?.data);
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
        isAuthenticated: !!user,
        isTeacher: user?.role === 'teacher',
        isStudent: user?.role === 'student',
        isAdmin: user?.role === 'admin',
        verifyAuth // Añadimos esta función al contexto
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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