import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: '',
};

const currentChannelSlice = createSlice({
  name: "currentChannel",
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setCurrentChannel } = currentChannelSlice.actions;
export default currentChannelSlice.reducer;
