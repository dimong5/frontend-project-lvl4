import React, { useState } from "react";
import "../App.css";
import AuthContext from "../context";
import MessageIpaContext from "../context/massageApi.js";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Error from "./Error.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks";
import axios from "axios";
import { addMany } from "../slices/channelsSlice";
import {
  addMany as addMessages,
  addOne as addMessage,
} from "../slices/messagesSlice";



function App() {
  return (
        <Router>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
  );
}

export default App;
