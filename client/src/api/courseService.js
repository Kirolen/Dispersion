import api from './api';  

export const createCourse = async (courseName, teacherId) => {
  try {
    const response = await api.post('/create-courses', { course_name: courseName, teacher_id: teacherId });
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
