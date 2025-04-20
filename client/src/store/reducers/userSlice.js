import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem('theme');
const savedPush = localStorage.getItem('pushNotifications');

const userSlice = createSlice({
  name: "user",
  initialState: {
    user_id: -1,
    role: "Student",
    notification: {
      unreadChats: [],
      unreadCourses: []
    },
    isDarkMode: savedTheme ? savedTheme === 'dark' : true,
    isPushEnabled: savedPush === "true" 
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
      const { type, value } = action.payload;
      if (type === "chat" && !state.notification.unreadChats.includes(value)) {
        state.notification.unreadChats.push(value);
      } else if (type === "course" && !state.notification.unreadCourses.includes(value)) {
        state.notification.unreadCourses.push(value);
      }
    },
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
    },
    togglePushNotifications: (state) => {
      state.isPushEnabled = !state.isPushEnabled;
      localStorage.setItem('pushNotifications', String(state.isPushEnabled));
    }
  }
});

export const {
  setUserId,
  setRole,
  setNotification,
  addNotification,
  toggleTheme,
  togglePushNotifications
} = userSlice.actions;

export default userSlice.reducer;
