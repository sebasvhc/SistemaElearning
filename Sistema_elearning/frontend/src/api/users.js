// api/users.js
export const getUserGamification = async () => {
  try {
    const response = await api.get('/users/me/gamification/');
    return response.data;
  } catch (error) {
    console.error('Error fetching gamification data:', error);
    throw new Error('No se pudo cargar la información de gamificación');
  }
};