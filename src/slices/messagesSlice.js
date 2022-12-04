/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash';
import { removeChannel, setInitialState } from './channelsSlice';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setInitialState, (state, action) => {
        state.messages = action.payload.messages;
      })
      .addCase(removeChannel, (state, action) => {
        state.messages = remove(state.messages, (message) => message.channelId !== action.payload);
      });
  },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
