import { createSlice } from "@reduxjs/toolkit";
import { removeChannel } from "./channelsSlice";

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
  extraReducers: builder => {
    builder.addCase(removeChannel, (state, action) => {
      const newState = state.value.filter((message) => {
        return message.channelId !== action.payload;
      })
      state.value = newState
      return state
    })
  }
});

export const { addOne, addMany, removeMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
