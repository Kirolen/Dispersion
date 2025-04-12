import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatId: "-1",
    messages: [],
    chatDetailsActive: false
  },
  reducers: {
    setChatId: (state, action) => {
      state.chatId = action.payload; 
    },
    setMessages: (state, action) => {
      state.messages = action.payload; 
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload); 
    },
    addMessageReverse: (state, action) => {
      state.messages.unshift(action.payload); 
    },
    setChatDetailsActive: (state, action) => {
        state.chatDetailsActive = action.payload;
    },    
  },
});

export const { setChatId, addMessage, addMessageReverse, clearMessages, setChatDetailsActive, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
