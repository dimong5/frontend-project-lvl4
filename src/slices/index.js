import { configureStore } from "@reduxjs/toolkit";
import channelsReducer from "./channelsSlice";
import messagesReducer from "./messagesSlice";
import currentChannelReducer from "./currentCannelSlice";

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    currentChannel: currentChannelReducer,
  },
});