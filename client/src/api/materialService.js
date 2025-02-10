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

export const getStudentTaskInfo = async (material_id, user_id) => {
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

export const submitSubmission = async (material_id, user_id) => {
    try {
        const response = await api.post("/material/hand-in-task", { material_id, user_id});
        console.log(response.data.data)
        return response.data.data;
    } catch (error) {
        throw new Error("Error submitting assignment: " + error.message);
    }
};


export const returnSubmission = async (material_id, user_id) => {
    try {
        const response = await api.get(`/material/get-submission/${material_id}/${user_id}`);
        return response.data.data;
    } catch (error) {
        throw new Error("Error fetching submission: " + error.message);
    }
};

export const gradeTask = async (material_id, student_id, teacher_id, grade, message) => {
    try {
        const response = await api.post('/material/grade-student-task', { material_id, student_id, teacher_id, grade, message });
        return response.data.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};

export const getAllStudentAssigments = async (user_id) => {
    try {
        const response = await api.get(`/material/get-all-course-tasks/${user_id}`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};

export const getFilteredCourses = async (user_id, filterValue) => {
    try {
        const response = await api.get(`/material/get-filtered-courses/${user_id}?filterValue=${filterValue}`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};


export const updateStundetTask = async (material_id, user_id, files) => {
    try {
        console.log("service")
        const response = await api.post(`/material/update-student-task`, {material_id, user_id, files});
        return response.data.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
}
