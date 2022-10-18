import { useState } from "react";
import AuthContext from "../context";

const AuthProvider = ({ children }) => {
  //localStorage.clear()
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(
    currentUser ? { username: currentUser.username } : null
  );

  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("user getAuthHeader", user);
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    }

    return {};
  };

  const logIn = (user) => {
    //localStorage.setItem("user", JSON.stringify(user));
    setUser({ username: user.username });
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem("user");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ loggedIn, logIn, logOut, user, getAuthHeader }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;