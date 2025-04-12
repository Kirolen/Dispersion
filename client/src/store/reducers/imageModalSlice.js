import { createSlice } from '@reduxjs/toolkit';

const imageModal = createSlice({
  name: 'imgModal',
  initialState: {
    isImageOpen: false,
    currentImage: null
  },
  reducers: {
    toggleImageModal: (state) => {
      state.isImageOpen = !state.isImageOpen;
    },
    setCurrentImage: (state, actions) => {
        state.currentImage = actions.payload
    }
  },
});

export const { toggleImageModal, setCurrentImage } = imageModal.actions;
export default imageModal.reducer;
