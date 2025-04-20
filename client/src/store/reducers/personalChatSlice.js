import { createSlice, current } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatId: "-1",
    messages: [],
    chatDetailsActive: false,
    currentChatDetail: {
      id: "",
      name: "",
      avatar: "",
      bi0: ""
    }
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
    setCurrentChatDetail: (state, action) => {
      state.currentChatDetail = action.payload;
    }
  },
});

export const { setChatId, addMessage, addMessageReverse, clearMessages, setChatDetailsActive, setMessages, setCurrentChatDetail } = chatSlice.actions;
export default chatSlice.reducer;
