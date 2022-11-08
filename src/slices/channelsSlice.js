import { createSlice } from "@reduxjs/toolkit";

const defaultChannelId = 1;

const initialState = {
    channels: [],
    currentChannel: defaultChannelId, 
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setInitialState: (state, action) => {
      state.channels = action.payload.channels;
    },
    addOne: (state, action) => {
      const channel = action.payload;
      state.channels.push(channel);
      state.currentChannel = channel.id
    },
    removeChannel: (state, action) => {
      const newState = state.channels.filter(
        (el) => el.id !== action.payload
      );
      state.channels = newState;
      state.currentChannel = defaultChannelId;
    },
    renameChannel: (state, action) => {
      const channelIndex = state.channels.findIndex(
        (el) => el.id === action.payload.id
      );
      state.channels[channelIndex].name = action.payload.name;
    },
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    }
  },
});

export const { addOne, addMany, removeChannel, renameChannel, setCurrentChannel, setInitialState } = channelsSlice.actions;
export default channelsSlice.reducer;