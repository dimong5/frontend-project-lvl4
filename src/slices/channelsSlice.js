import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    channels: [],
    currentChannel: 1, 
  },
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    addOne: (state, action) => {
      state.value.channels.push(action.payload);
    },
    addMany: (state, action) => {
      state.value.channels = [...state.value.channels, ...action.payload];
    },
    removeChannel: (state, action) => {
      const newState = state.value.channels.filter(
        (el) => el.id !== action.payload
      );
      state.value.channels = newState;
    },
    renameChannel: (state, action) => {
      const channelIndex = state.value.channels.findIndex(
        (el) => el.id === action.payload.id
      );
      state.value.channels[channelIndex].name = action.payload.name;
    },
    setCurrentChannel: (state, action) => {
      state.value.currentChannel = action.payload;
    }
  },
});

export const { addOne, addMany, removeChannel, renameChannel, setCurrentChannel } = channelsSlice.actions;
export default channelsSlice.reducer;