import { io } from "socket.io-client";

export const socket = io();
export let socketID = "";
// socket.on("connect", () => {
//   socketID = socket.id;
// });
export const sendMessage = (args) => {
  const { dispatch, addMessage } = args;
  socket.on("newMessage", (msg) => {
    console.log(msg);
    dispatch(addMessage(msg));
  });
};
