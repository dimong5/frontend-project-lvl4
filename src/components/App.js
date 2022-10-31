import React from "react";
import "../App.css";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Error from "./Error.jsx";
import Signup from "./Signup.jsx"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
        <Router>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
  );
}

export default App;
