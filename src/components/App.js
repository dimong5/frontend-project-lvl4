import React, { useState } from "react";
import "../App.css";
import AuthContext from "../context";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Error from "./Error.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const logIn = (user) => {
    setUser(user)
    setLoggedIn(true);
   };
  const logOut = () => {
    localStorage.removeItem("userId");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};



function App() {
  return (
    <AuthProvider>
      <Router>
        {/* <div className="App"> */}
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Error />} />
          </Routes>
        {/* </div> */}
      </Router>
    </AuthProvider>
  );
}

export default App;
