import api from './api';

export const updateUserInfo = async (newUserInfo) => {
  try {
    const response = await api.post(`/user/update-info`, newUserInfo);
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred during update info.');
    } else if (error.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error('Error during update info request: ' + error.message);
    }
  }
};

export const getUserInfo = async () => {
  try {
    const response = await api.get(`/user/info`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred while fetching user info.');
    } else if (error.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error('Error during fetch user info request: ' + error.message);
    }
  }
};