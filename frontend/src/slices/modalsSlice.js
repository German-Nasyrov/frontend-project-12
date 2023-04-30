/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalsSlice = createSlice({
  name: 'modals',
  initialState: {
    isOpened: false,
    type: null,
    item: null,
  },
  reducers: {
    onShow: (state, action) => {
      const { type, item } = action.payload;
      state.isOpened = true;
      state.type = type;
      state.item = item;
    },
    onHide: (state) => {
      state.isOpened = false;
      state.type = null;
      state.item = null;
    },
  },
});

export const {
  onShow,
  onHide,
} = modalsSlice.actions;

export default modalsSlice.reducer;
