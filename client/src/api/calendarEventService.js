import api from './api';  

export const addCalendarEvent = async (user_id, title, eventType, startDate, endDate) => {
  try {
    const response = await api.post('/calendar/add-calendar-event', { user_id, title, eventType, startDate, endDate });
    return response.data;
  } catch (error) {
    throw new Error('Error creating course: ' + error.message);
  }
};

export const getCalendarEvents = async (userId) => {
  try {
    console.log("Getting events...")
    const response = await api.get(`/calendar/get-calendar-event/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error joining course: ' + error.message);
  }
};
