import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState({
        user: null,
        loading: true,
        error: null
    });

    // Función para verificar autenticación
    const verifyAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                throw new Error('Token expired');
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const { data: userData } = await api.get('/users/me/');
            const { data: gamificationData } = await api.get('/users/me/gamification/');

            setAuthState({
                user: {
                    ...userData,
                    ...gamificationData,
                    token,
                    role: userData.role
                },
                loading: false,
                error: null
            });

            return true;
        } catch (error) {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];

            setAuthState({
                user: null,
                loading: false,
                error: error.message
            });

            return false;
        }
    };

    // Función de login
    const login = async (email, password) => {
        try {
            setAuthState(prev => ({ ...prev, loading: true, error: null }));

            const { data } = await api.post('/token/', { email, password });
            localStorage.setItem('token', data.access);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

            const { data: userData } = await api.get('/users/me/');
            const user = {
                ...userData,
                token: data.access,
                role: userData.role
            };

            setAuthState({
                user,
                loading: false,
                error: null
            });

            return {
                success: true,
                user
            };
        } catch (error) {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];

            const errorMessage = error.response?.data?.detail || 'Credenciales inválidas';

            setAuthState({
                user: null,
                loading: false,
                error: errorMessage
            });

            return {
                success: false,
                error: errorMessage
            };
        }
    };

    // Función de registro
    const register = async (userData) => {
        try {
            setAuthState(prev => ({ ...prev, loading: true }));
            await api.post('/register/', userData);
            setAuthState(prev => ({ ...prev, loading: false }));
            return { success: true };
        } catch (error) {
            setAuthState(prev => ({
                ...prev,
                loading: false,
                error: error.response?.data || 'Error en el registro'
            }));

            return {
                success: false,
                error: error.response?.data || 'Error en el registro'
            };
        }
    };

    // Función de logout
    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];

        setAuthState({
            user: null,
            loading: false,
            error: null
        });

        navigate('/login');
    };

    // Función para actualizar XP
    const updateUserXP = async (xpEarned) => {
        try {
            const { data } = await api.post('/users/me/update_xp/', { xp: xpEarned });
            setAuthState(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    xp: data.new_xp,
                    badges: data.new_badges || prev.user.badges
                }
            }));
            return data;
        } catch (error) {
            console.error('Error updating XP:', error);
            throw error;
        }
    };

    // Valor del contexto (ÚNICA declaración)
    const contextValue = useMemo(() => ({
        ...authState,
        isAuthenticated: !!authState.user,
        isTeacher: authState.user?.role === 'teacher',
        isStudent: authState.user?.role === 'student',
        isAdmin: authState.user?.role === 'admin',
        login,
        register,
        logout,
        verifyAuth,
        updateUserXP
    }), [authState]);

    // Efecto para verificar autenticación al montar
    useEffect(() => {
        verifyAuth();
    }, []);

    return (
        <AuthContext.Provider value={contextValue}>
            {!authState.loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};