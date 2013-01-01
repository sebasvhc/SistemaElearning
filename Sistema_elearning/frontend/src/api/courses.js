// api/courses.js
import api from './api';

export const fetchTeacherCourses = async () => {
    try {
        const response = await api.get('/courses/teacher/');
        return response.data;
    } catch (error) {
        console.error('Error fetching teacher courses:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        throw error;
    }
};


export const fetchStudentCourses = async () => {
  try {
    // Usa la ruta exacta que aparece en tu backend
    const response = await api.get('/student-courses/');
    return response.data;
  } catch (error) {
    console.error('Error en fetchStudentCourses:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      responseData: error.response?.data
    });
    
    let errorMessage = 'Error al cargar los cursos';
    if (error.response?.status === 404) {
      errorMessage = 'Endpoint no encontrado. Verifica la conexión con el backend';
    } else if (error.response?.status === 401) {
      errorMessage = 'No autorizado. Por favor inicia sesión nuevamente';
    }
    
    throw new Error(errorMessage);
  }
};

export const createCourse = async (courseData) => {
    try {
        const response = await api.post('/courses/', courseData);
        return response.data;
    } catch (error) {
        console.error('Error creating course:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        throw error;
    }
};

export const enrollStudentInCourse = async (courseId, studentId) => {
    try {
        const response = await api.post(`/courses/${courseId}/enroll/`, { student_id: studentId });
        return response.data;
    } catch (error) {
        console.error('Error enrolling student:', error);
        throw error;
    }
};

export const getCourseDetails = async (courseId) => {
    try {
        const response = await api.get(`/courses/${courseId}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching course details:', error);
        throw error;
    }
};

export const createCompleteCourse = async (courseData) => {
  const response = await api.post('/courses/create-complete/', courseData);
  return response.data;
};

export const fetchPeriods = async () => {
  const response = await api.get('/courses/periods/');
  return response.data;
};

export const uploadCourseMaterial = async (courseId, formData) => {
  const response = await api.post(
    `/courses/${courseId}/materials/`, 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
};