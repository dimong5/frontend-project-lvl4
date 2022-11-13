import { useState } from "react";
import AuthContext from "../context";
import axios from "axios";

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(
    currentUser ? { username: currentUser.username } : null
  );

  const getAuthHeader = () => {
    const { token } = JSON.parse(localStorage.getItem("user"));
    if (user && token) {
      return { Authorization: `Bearer ${token}` };
    }

    return {};
  };

  const logIn = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser({ username: user.username });
  };
  const logOut = () => {
    localStorage.removeItem("user");
    setUser(null)
  };

  const signUp = async (user) => {
  return axios.post("/api/v1/signup", user);
  };

  return (
    <AuthContext.Provider
      value={{ logIn, logOut, signUp, user, getAuthHeader }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;