import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data.token;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred during login.');
    } else if (error.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error('Error during login request: ' + error.message);
    }
  }
};

export const register = async (first_name, last_name, email, password, role) => {
  try {
    const response = await api.post('/auth/registration', { first_name, last_name, email, password, role });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred during register.');
    } else if (error.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error('Error during register request: ' + error.message);
    }
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
