import api from './api';

export const addTask = async (assignmentData) => {
    try {
        const response = await api.post('/material/add-material', assignmentData);
        return response.data;
    } catch (error) {
        throw new Error('Error adding assignment: ' + error.message);
    }
};

export const getMaterialInfo = async (assignmentID) => {
    try {
        const response = await api.get(`/material/get-material-info/${assignmentID}`);
        return response.data;
    } catch (error) {
        throw new Error('Error getting assignment info: ' + error.message);
    }
}

export const deleteMaterial = async (assignmentID) => {
    try {
        const response = await api.delete(`/material/delete-material/${assignmentID}`);
        return response.data;
    } catch (error) {
        throw new Error('Error getting assignment info: ' + error.message);
    }
}

export const updateMaterialInfo = async (assignmentID, assignmentData) => {
    try {
        const response = await api.post(`/material/update-material-info/${assignmentID}`, assignmentData);
        return response.data;
    } catch (error) {
        throw new Error('Error getting assignment info: ' + error.message);
    }
}

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

export const getAllAssignmentsForOneCourseByTeacher = async (user_id, course_id) => {
    try {
        console.log(user_id, course_id)
        const response = await api.get(`/material/get-all-assignments-for-one-course-by-teacher/${user_id}/${course_id}`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
}

export const getStudentTaskInfo = async (material_id, user_id) => {
    try {
        const response = await api.get(`/material/get-task-info-for-student/${material_id}?userId=${user_id}`);
        return response.data.data;
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

export const getFilteredAssignmentsByStudent = async (user_id, filterValue) => {
    try {
        const response = await api.get(`/material/get-filtered-courses-assignments-student/${user_id}?filterValue=${filterValue}`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};

export const getFilteredCoursesAssignmentsForTeacher = async (user_id, filterValue) => {
    try {
        const response = await api.get(`/material/get-filtered-courses-assignments-teacher/${user_id}?filterValue=${filterValue}`);
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
