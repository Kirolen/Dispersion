import api from './api';  

export const addCalendarEvent = async (user_id, title, eventType, startDate, endDate) => {
  try {
    const response = await api.post('/calendar/add-calendar-event', { user_id, title, eventType, startDate, endDate });
    return response.data;
  } catch (error) {
    throw new Error('Error adding event: ' + error.message);
  }
};

export const getCalendarEvents = async (userId) => {
  try {
    const response = await api.get(`/calendar/get-calendar-event/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error getting events: ' + error.message);
  }
};

export const deleteUserEvent = async (user_id, event_id) => {
  try {
    console.log("Request to server...")
    const response = await api.delete(`/calendar/delete-user-event/${user_id}/${event_id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error deleting event: ' + error.message);
  }
}