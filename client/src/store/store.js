import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './reducers/menuSlice';
import userReducer from './reducers/userSlice'
import chatReducer from './reducers/personalChatSlice'
import assignmentReducer from './reducers/assignmentSlice'

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    user: userReducer,
    chat: chatReducer,
    assignment: assignmentReducer
  }
});
