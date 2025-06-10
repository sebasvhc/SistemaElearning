// src/api/courses.js
import api from './api';

// Función para obtener cursos del profesor
export const fetchTeacherCourses = async () => {
  try {
    const response = await api.get('/teacher/courses/');
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
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
    const response = await api.post('/courses/', courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
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