import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    addOne: (state, action) => {
      state.push(action.payload);
    },
    addMany: (state, action) => {
      state.value = [...state.value, ...action.payload] ;
    },
    removeChannel: (state, action) => {
      const newState = state.filter((el) => el.id !== action.payload);
      state = newState;
    },
  },
});

export const { addOne, addMany, removeChannel } = channelsSlice.actions;
export default channelsSlice.reducer;