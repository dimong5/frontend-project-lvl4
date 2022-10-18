import init from "./init.js";
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { io } from "socket.io-client";
import ReactDOM from "react-dom/client";


const run = async () => {
  const socket = io();
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(await init(socket)) //??
};

run();


