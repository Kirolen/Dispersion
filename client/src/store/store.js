import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './reducers/menuSlice';
import userReducer from './reducers/userSlice'
import chatReducer from './reducers/personalChatSlice'

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    user: userReducer,
    chat: chatReducer
  }
});
