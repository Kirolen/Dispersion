import api from './api';

export const addMaterial = async (title, description, type, dueDate, points, course_id, assignedUsers, attachments) => {
    try {
        const response = await api.post('/material/send-material',
            {
                title,
                description,
                type,
                dueDate,
                points,
                course_id,
                assignedUsers,
                attachments
            });
        return response.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};

export const getMaterials = async (course_id, user_id) => {
    try {
        const response = await api.get(`/material/get-material/${course_id}?userId=${user_id}`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};

export const getAllMaterials = async (course_id) => {
    try {
        const response = await api.get(`/material/get-all-material/${course_id}`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};

export const getMaterialInfo = async (material_id, user_id) => {
    try {
        const response = await api.get(`/material/get-material-info/${material_id}?userId=${user_id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};