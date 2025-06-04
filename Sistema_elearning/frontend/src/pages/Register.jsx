import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Añadido estado de carga
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Activar estado de carga
        
        try {
            const response = await axios.post(
                'http://localhost:8000/api/users/register/', // Asegúrate que esta ruta es correcta
                formData
            );
            
            if (response.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            // Manejo mejorado de errores
            const errorData = err.response?.data;
            
            if (errorData) {
                if (typeof errorData === 'object') {
                    // Extrae el primer mensaje de error disponible
                    const firstErrorKey = Object.keys(errorData)[0];
                    const firstError = errorData[firstErrorKey];
                    setError(
                        Array.isArray(firstError) 
                            ? firstError[0] 
                            : String(firstError)
                    );
                } else {
                    setError(String(errorData));
                }
            } else {
                setError('Error al registrar usuario');
            }
        } finally {
            setIsLoading(false); // Desactivar estado de carga
        }
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerCard}>
                <h1 className={styles.title}>Crea tu cuenta</h1>
                <p className={styles.subtitle}>Únete a nuestra plataforma de aprendizaje</p>
                
                {/* Mensaje de error seguro */}
                {error && (
                    <div className={styles.errorAlert}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.nameContainer}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="first_name">Nombre</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                placeholder="Tu nombre"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="last_name">Apellido</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                placeholder="Tu apellido"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Correo electrónico</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="ejemplo@correo.com" 
                            required 
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Mínimo 8 caracteres"
                            required
                            minLength="8"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="role">Tipo de usuario</label>
                        <select 
                            id="role" 
                            name="role" 
                            onChange={handleChange} 
                            value={formData.role}
                            className={styles.select}
                            required
                        >
                            <option value="student">Estudiante</option>
                            <option value="teacher">Profesor</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </button>

                    <p className={styles.loginLink}>
                        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;