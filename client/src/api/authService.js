import api from './api';  

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {email, password}); 
    return response.data.token;
  } catch (error) {
    throw new Error('Error creating course: ' + error.message);
  }
};

export const register = async (first_name, last_name, email, password, role) => {
  try {
    const response = await api.post('/auth/registration', {first_name, last_name, email, password, role});
    return response.data;
  } catch (error) {
    throw new Error('Error joining course: ' + error.message);
  }
};

export const getMyCourses = async () => {
    try {
      const response = await api.get('/get-my-courses');
      return response.data.data;
    } catch (error) {
      throw new Error('Error creating course: ' + error.message);
    }
  };
