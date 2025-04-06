import { createSlice } from '@reduxjs/toolkit';

const assignmentSlice = createSlice({
    name: 'assignment',
    initialState: {
        assignment: null,
        attachments: [],
        feedback: "",
        grade: "",
        status: "not_passed"
    },
    reducers: {
        setAssignment: (state, action) => {
            state.assignment = action.payload;
        },
        setAttachments: (state, action) => {
            state.attachments = action.payload;
        },
        setFeedback: (state, action) => {
            state.feedback = action.payload
        },
        setGrade: (state, action) => {
            state.grade = action.payload
        },
        setStatus: (state, action) => {
            state.status = action.payload
        }
    },
});

export const { setAssignment, setAttachments, addAttachment, setFeedback, setGrade, setStatus } = assignmentSlice.actions;
export default assignmentSlice.reducer;
