import api from './api';

export const createTest = async (test) => {
    try {
        console.log(test)
        const response = await api.post('/test/create', { test });
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'An error occurred during creating test.');
        } else if (error.request) {
            throw new Error('No response from server. Please check your network connection.');
        } else {
            throw new Error('Error during creating test request: ' + error.message);
        }
    }
};

export const getTests = async () => {
    try {
        const response = await api.get('/test/');
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'An error occurred during getting test.');
        } else if (error.request) {
            throw new Error('No response from server. Please check your network connection.');
        } else {
            throw new Error('Error during getting test request: ' + error.message);
        }
    }
};

export const getTestById = async (test_id) => {
    try {
        const response = await api.get(`/test/${test_id}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'An error occurred during getting test.');
        } else if (error.request) {
            throw new Error('No response from server. Please check your network connection.');
        } else {
            throw new Error('Error during getting test request: ' + error.message);
        }
    }
};

export const updateTest = async (updatedTest, test_id) => {
    try {
        console.log(updatedTest)
        console.log(test_id)
        const response = await api.put(`/test/${test_id}`, { updatedTest });
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'An error occurred during creating test.');
        } else if (error.request) {
            throw new Error('No response from server. Please check your network connection.');
        } else {
            throw new Error('Error during creating test request: ' + error.message);
        }
    }
}

export const startTest = async (materialID) => {
     try {
        console.log(materialID)
        const response = await api.post(`/test/start/${materialID}`);
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'An error occurred during starting test.');
        } else if (error.request) {
            throw new Error('No response from server. Please check your network connection.');
        } else {
            throw new Error('Error during starting test request: ' + error.message);
        }
    }
}

export const takeTest = async (materialID, testAnswers) => {
     try {
        console.log(testAnswers)
        const response = await api.post(`/test/take/${materialID}`, testAnswers);
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'An error occurred during starting test.');
        } else if (error.request) {
            throw new Error('No response from server. Please check your network connection.');
        } else {
            throw new Error('Error during starting test request: ' + error.message);
        }
    }
}

export const getTestAttempt = async (materialID, studentId) => {
     try {
        const response = await api.get(`/test/attempt/${materialID}/${studentId}`);
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'An error occurred during starting test.');
        } else if (error.request) {
            throw new Error('No response from server. Please check your network connection.');
        } else {
            throw new Error('Error during starting test request: ' + error.message);
        }
    }
}

export const updateScore = async (materialID, studentId, newScore) => {
     try {
        const response = await api.post(`/test/score-update/${materialID}/${studentId}`, newScore);
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'An error occurred during starting test.');
        } else if (error.request) {
            throw new Error('No response from server. Please check your network connection.');
        } else {
            throw new Error('Error during starting test request: ' + error.message);
        }
    }
}