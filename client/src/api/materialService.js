import api from './api';

export const addTask = async (title, description, type, dueDate, points, course_id, assignedUsers, attachments) => {
    try {
        const response = await api.post('/material/add-material',
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

export const getCourseMaterialsForStudent = async (course_id, user_id) => {
    try {
        const response = await api.get(`/material/get-course-material-for-student/${course_id}?userId=${user_id}`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};

export const getAllCourseMaterials = async (course_id) => {
    try {
        const response = await api.get(`/material/get-all-course-material/${course_id}`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};

export const getTaskInfoForStudent = async (material_id, user_id) => {
    try {
        const response = await api.get(`/material/get-task-info-for-student/${material_id}?userId=${user_id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};

export const getStudentsTasksResult = async (material_id) => {
    try {
        console.log(material_id)
        const response = await api.get(`/material/get-students-tasks-result/${material_id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};
export const getStudentTasksResult = async (course_id, user_id) => {
    try {
        const response = await api.get(`/material/get-student-task-result/${course_id}?userId=${user_id}`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};