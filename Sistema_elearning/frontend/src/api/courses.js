// src/api/courses.js
import api from './api';

// Función para obtener cursos del profesor
export const fetchTeacherCourses = async () => {
    try {
        const response = await api.get('/courses/teacher/'); // Asegúrate que coincida con tu backend
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.error('Verifica que:');
            console.error('1. La URL en el backend sea exactamente /api/courses/teacher/');
            console.error('2. El servidor Django se haya reiniciado después de los cambios');
            throw new Error('La ruta no existe.');
        }
        throw error;
    }
};
// Función para obtener cursos del estudiante (AÑADE ESTA FUNCIÓN)
export const fetchStudentCourses = async () => {
    try {
        const response = await api.get('/student/courses/');
        return response.data;
    } catch (error) {
        console.error('Error fetching student courses:', error);
        throw error;
    }
};

// Función para crear cursos
export const createCourse = async (courseData) => {
  try {
    const response = await api.post('/courses/', courseData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Doble verificación
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Redirigir a login si el token es inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

// Función para manejar errores
export const handleApiError = (error) => {
    if (error.response) {
        return {
            message: error.response.data.message || 'Error en la solicitud',
            status: error.response.status,
            data: error.response.data
        };
    } else if (error.request) {
        return { message: 'No se recibió respuesta del servidor' };
    } else {
        return { message: error.message || 'Error al configurar la solicitud' };
    }
};

export const createQuiz = async (quizData) => {
    try {
        const response = await api.post('/quizzes/', quizData);
        return response.data;
    } catch (error) {
        console.error('Error creating quiz:', error);
        throw error; // Asegúrate de propagar el error para manejarlo en el componente.  
    }
};