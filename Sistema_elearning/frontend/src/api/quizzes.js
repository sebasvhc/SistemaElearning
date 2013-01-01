import api from './api';

export const createQuiz = async (quizData) => {
  const response = await api.post('/quizzes/', quizData);
  return response.data;
};

export const getQuizzesByCourse = async (courseId) => {
  const response = await api.get(`/quizzes/?course=${courseId}`);
  return response.data;
};

export const updateQuiz = async (quizId, quizData) => {
  const response = await api.put(`/quizzes/${quizId}/`, quizData);
  return response.data;
};

export const deleteQuiz = async (quizId) => {
  const response = await api.delete(`/quizzes/${quizId}/`);
  return response.data;
};

export const submitQuizAnswers = async (quizId, answers) => {
  const response = await api.post(`/quizzes/${quizId}/submit/`, { answers });
  return response.data;
};