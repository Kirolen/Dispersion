import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatId: "",
    messages: [],
    chatDetailsActive: false
  },
  reducers: {
    setChatId: (state, action) => {
        console.log(action.payload)
      state.chatId = action.payload; 
    },
    setMessages: (state, action) => {
      state.messages = action.payload; 
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload); 
    },
    clearMessages: (state) => {
      state.messages = []; 
    },
    setChatDetailsActive: (state, action) => {
        state.chatDetailsActive = action.payload;
    }
  },
});

export const { setChatId, addMessage, clearMessages, setChatDetailsActive, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
