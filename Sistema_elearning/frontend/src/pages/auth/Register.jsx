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
        cedula: '',
        role: 'student'
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error del campo cuando se modifica
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) newErrors.email = 'Email es requerido';
        if (!formData.password.trim()) newErrors.password = 'Contraseña es requerida';
        if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
        if (!formData.first_name.trim()) newErrors.first_name = 'Nombre es requerido';
        if (!formData.last_name.trim()) newErrors.last_name = 'Apellido es requerido';
        if (!formData.cedula.trim()) newErrors.cedula = 'Cédula es requerida';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que todos los campos estén presentes
        if (!formData.password) {
            setErrors({ ...errors, password: 'La contraseña es requerida' });
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8000/api/users/register/',
                {
                    ...formData,
                    cedula: formData.cedula.trim() // Asegurar formato correcto
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.status === 201) {
                navigate('/login', {
                    state: {
                        registrationSuccess: true,
                        message: 'Registro exitoso! Por favor inicia sesión.'
                    }
                });
            }
        } catch (err) {
            console.error('Error en registro:', err);

            if (err.response) {
                const { data } = err.response;

                // Mapear errores del backend
                const backendErrors = {};
                Object.keys(data).forEach(key => {
                    backendErrors[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
                });

                setErrors(backendErrors);
            } else if (err.request) {
                setErrors({ general: 'No se recibió respuesta del servidor. Intenta nuevamente.' });
            } else {
                setErrors({ general: 'Error al configurar la solicitud: ' + err.message });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerCard}>
                <h1 className={styles.title}>Crea tu cuenta</h1>
                <p className={styles.subtitle}>Únete a nuestra plataforma de aprendizaje</p>

                {errors.general && (
                    <div className={styles.errorAlert}>
                        {errors.general}
                        <button
                            onClick={() => setErrors(prev => ({ ...prev, general: null }))}
                            className={styles.errorCloseButton}
                            aria-label="Cerrar mensaje de error"
                        >
                            &times;
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <div className={styles.nameContainer}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="first_name">Nombre*</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                placeholder="Tu nombre"
                                value={formData.first_name}
                                onChange={handleChange}
                                className={errors.first_name ? styles.errorInput : ''}
                            />
                            {errors.first_name && <span className={styles.errorText}>{errors.first_name}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="last_name">Apellido*</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                placeholder="Tu apellido"
                                value={formData.last_name}
                                onChange={handleChange}
                                className={errors.last_name ? styles.errorInput : ''}
                            />
                            {errors.last_name && <span className={styles.errorText}>{errors.last_name}</span>}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Correo electrónico*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="ejemplo@correo.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? styles.errorInput : ''}
                            autoComplete="username"
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Contraseña*</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Mínimo 8 caracteres"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? styles.errorInput : ''}
                            autoComplete="new-password"
                        />
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="cedula">Cédula*</label>
                        <input
                            type="text"
                            id="cedula"
                            name="cedula"
                            placeholder="Tu número de cédula"
                            value={formData.cedula}
                            onChange={handleChange}
                            className={errors.cedula ? styles.errorInput : ''}
                            maxLength="20"
                        />
                        {errors.cedula && <span className={styles.errorText}>{errors.cedula}</span>}
                        <small className={styles.hint}>Número de cédula es requerido para todos los usuarios</small>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="role">Tipo de usuario*</label>
                        <select
                            id="role"
                            name="role"
                            onChange={handleChange}
                            value={formData.role}
                            className={styles.select}
                        >
                            <option value="student">Estudiante</option>
                            <option value="teacher">Profesor</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className={styles.spinner} aria-hidden="true"></span>
                                Registrando...
                            </>
                        ) : (
                            'Registrarse'
                        )}
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