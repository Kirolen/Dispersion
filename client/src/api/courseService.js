import api from './api';  

export const createCourse = async (courseName, courseDesc, teacherId) => {
  try {
    const response = await api.post('/create-courses', { course_name: courseName, course_desc: courseDesc, teacher_id: teacherId });
    return response.data;
  } catch (error) {
    throw new Error('Error creating course: ' + error.message);
  }
};

export const joinCourse = async (userId, courseId) => {
  try {
    const response = await api.post('/join-course', { user_id: userId, course_id: courseId });
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

  export const getCourseInfo = async (courseId) => {
    try {
      const response = await api.get(`/course-name/${courseId}`);
      return response.data.data;
    } catch (error) {
      throw new Error('Error creating course: ' + error.message);
    }
  };

  export const getCoursePeople = async (courseId) => {
    try {
      const response = await api.get(`/course-info-people/${courseId}`);
      return response.data.data;
    } catch (error) {
      throw new Error('Error creating course: ' + error.message);
    }
  };

  export const getCourseChat = async (courseId) => {
    try {
      const response = await api.get(`/get-messages/${courseId}`);
      return response.data.data;
    } catch (error) {
      throw new Error('Error creating course: ' + error.message);
    }
  };

  export const addMessage = async (course_id, message) => {
    try {
      const response = await api.post(`/add-message`, {course_id, message});
      return response.data.data;
    } catch (error) {
      throw new Error('Error creating course: ' + error.message);
    }
  };