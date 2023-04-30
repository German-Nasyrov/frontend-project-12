/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice.js';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    allMessages: [],
  },
  reducers: {
    addMessages: (state, action) => {
      state.allMessages = action.payload;
    },
    addMessage: (state, action) => {
      state.allMessages.push(action.payload);
    },
    removeMessages: (state, action) => {
      const { id } = action.payload;
      const filteredMessages = state.allMessages.filter(({ channelId }) => channelId !== id);
      state.allMessages = filteredMessages;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
      const { id } = action.payload;
      const filteredMessages = state.allMessages.filter(({ channelId }) => channelId !== id);
      state.allMessages = filteredMessages;
    });
  },
});

export const {
  addMessages,
  addMessage,
  removeMessages,
} = messagesSlice.actions;
export default messagesSlice.reducer;
