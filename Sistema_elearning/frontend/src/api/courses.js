import api from './api';

export const fetchTeacherCourses = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/teacher/courses/');
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    throw error;
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await api.post('/courses/', courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};