/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { removeChannel, setInitialState } from './channelsSlice';

const initialState = {
  value: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addOne: (state, action) => {
      state.value = [...state.value, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setInitialState, (state, action) => {
        state.value = action.payload.messages;
      })
      .addCase(removeChannel, (state, action) => {
        const newState = state.value.filter((message) => message.channelId !== action.payload);
        state.value = newState;
      });
  },
});

export const { addOne, addMany, removeMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
