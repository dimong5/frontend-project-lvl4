/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null, item: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showAddChannelModal: (state, action) => {
      state.type = 'addChannel';
      state.item = action.payload.item;
    },
    showRenameChannelModal: (state, action) => {
      state.type = 'renameChannel';
      state.item = action.payload.item;
    },
    showRemoveChannelModal: (state, action) => {
      state.type = 'removeChannel';
      state.item = action.payload.item;
    },
    hideModal: (state) => {
      state.type = null;
      state.item = null;
    },
  },
});

export const {
  showAddChannelModal,
  showRenameChannelModal,
  showRemoveChannelModal,
  hideModal,
} = modalSlice.actions;
export default modalSlice.reducer;
