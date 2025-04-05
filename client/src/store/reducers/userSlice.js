import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user_id: -1,
        role: "Student",
        notification: {
            unreadChats: [],
            unreadCourses: []
        }
    },
    reducers: {
        setUserId: (state, action) => {
            state.user_id = action.payload;
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
        setNotification: (state, action) => {
            state.notification = action.payload;
        },
        addNotification: (state, action) => {
            state.notification.push(action.payload);
        },
    }
});

export const { setUserId, setRole, setNotification, addNotification } = userSlice.actions;

export default userSlice.reducer;
