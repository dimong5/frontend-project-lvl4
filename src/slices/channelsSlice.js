/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash';

const defaultChannelId = 1;

const initialState = {
  channels: [],
  currentChannel: defaultChannelId,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setInitialState: (state, action) => {
      state.channels = action.payload.channels;
    },
    addChannel: (state, action) => {
      const channel = action.payload;
      state.channels.push(channel);
      state.currentChannel = channel.id;
    },
    removeChannel: (state, action) => {
      state.channels = remove(state.channels, (el) => el.id !== action.payload);
      state.currentChannel = defaultChannelId;
    },
    renameChannel: (state, action) => {
      const channel = state.channels.find(
        (el) => el.id === action.payload.id,
      );
      channel.name = action.payload.name;
    },
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
  },
});

export const {
  addChannel, removeChannel, renameChannel, setCurrentChannel, setInitialState,
} = channelsSlice.actions;
export default channelsSlice.reducer;
