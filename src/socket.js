import { io } from "socket.io-client";

export const socket = io.connect("http://localhost:3000");
export let socketID = "";
// socket.on("connect", () => {
//   socketID = socket.id;
// });
