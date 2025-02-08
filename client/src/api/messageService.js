import api from './api';  

export const markLastCourseMessageAsRead = async (user_id, course_id) => {
  try {
         console.log(user_id, course_id)
    const response = await api.post('/mark-last-course-message', {user_id, course_id}); 
    console.log(response.data)
    return response.data
  } catch (error) {
    throw new Error('Error creating course: ' + error.message);
  }
};

export const findCoursesWithUnreadMessages = async (user_id) => {
    try {
        console.log(user_id)
      const response = await api.get(`/get-courses-with-unread-messages/${user_id}`); 
      return response.data
    } catch (error) {
      throw new Error('Error creating course: ' + error.message);
    }
  };