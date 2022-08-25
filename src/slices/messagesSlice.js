import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addOne: (state, action) => {
      state.value = [...state.value, action.payload];
    },
    addMany: (state, action) => {
      state.value = [ ...action.payload];
    },
    removeremoveMessage: (state, action) => {
      const newState = state.filter((el) => el.id !== action.payload);
      state = newState;
    },
  },
});

export const { addOne, addMany, removeMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
