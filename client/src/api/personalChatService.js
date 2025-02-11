import api from './api';

export const searchUser = async (keyWord) => {
    try {
        const response = await api.get(`/chat/search-user/${keyWord}`);
        return response
    } catch (error) {
        throw new Error('Error search users: ' + error.message);
    }
};

export const createChat = async ({ user1, user2 }) => {
    try {

        const response = await api.post(`/chat/create`, { user1, user2 });
        return response
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};

export const getUserChats = async () => {
    try {
        const response = await api.get(`/chat/user-chats`);
        return response
    } catch (error) {
        throw new Error('Error search users: ' + error.message);
    }
};

export const getChat = async (chatId) => {
    try {
        const response = await api.get(`/chat/chat/${chatId}`);
        return response
    } catch (error) {
        throw new Error('Error search users: ' + error.message);
    }
};

export const sendMessage = async (chatId, text, attachments) => {
    try {
        const response = await api.post(`/chat/send-message`, { chatId, text, attachments });
        return response
    } catch (error) {
        throw new Error('Error search users: ' + error.message);
    }
};

export const getMessages = async (chatId) => {
    try {
        const response = await api.get(`/chat/get-messages/${chatId}`);
        return response
    } catch (error) {
        throw new Error('Error search users: ' + error.message);
    }
};

export const findCoursesWithUnreadMessages = async (user_id) => {
    try {
        console.log(user_id)
        const response = await api.get(`/chat/get-courses-with-unread-messages/${user_id}`);
        return response.data
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};

export const markLastCourseMessageAsRead = async (user_id, course_id) => {
    try {
        console.log(user_id, course_id)
        const response = await api.post('/chat/mark-last-course-message', { user_id, course_id });
        console.log(response.data)
        return response.data
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};