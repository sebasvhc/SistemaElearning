// api/quizzes.js
import api from './api';

export const createQuiz = async (quizData) => {
    try {
        const response = await api.post('/quizzes/', quizData);
        return response.data;
    } catch (error) {
        console.error('Error creating quiz:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        throw error;
    }
};

export const getQuizzesByCourse = async (courseId) => {
    try {
        const response = await api.get(`/quizzes/?course=${courseId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching quizzes by course:', error);
        throw error;
    }
};

export const getStudentQuizzes = async () => {
  try {
    // Usa la ruta exacta como está definida en tu backend
    const response = await api.get('/student-quizzes/');
    return response.data;
  } catch (error) {
    console.error('Error fetching student quizzes:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    throw new Error('No se pudieron cargar las evaluaciones. Intenta nuevamente.');
  }
};

export const getQuizDetails = async (quizId) => {
    try {
        const response = await api.get(`/quizzes/${quizId}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz details:', error);
        throw error;
    }
};

export const submitQuizAnswers = async (quizId, answers) => {
    try {
        const response = await api.post(`/quizzes/${quizId}/submit/`, { answers });
        return response.data;
    } catch (error) {
        console.error('Error submitting quiz answers:', error);
        throw error;
    }
};

export const getQuizResults = async (quizId) => {
    try {
        const response = await api.get(`/quizzes/${quizId}/results/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        throw error;
    }
};