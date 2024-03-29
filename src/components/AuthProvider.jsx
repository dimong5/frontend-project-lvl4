import React, { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context';
import routes from '../routes/routes';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(
    currentUser ? { username: currentUser.username } : null,
  );

  const getAuthHeader = useCallback(() => {
    const { token } = JSON.parse(localStorage.getItem('user'));
    if (user && token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }, [user]);

  const logIn = useCallback((userObj) => {
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser({ username: userObj.username });
  }, []);

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const signUp = async (userObj) => axios.post(routes.registrationPath(), userObj);

  const authContextValues = useMemo(
    () => ({
      logIn,
      logOut,
      signUp,
      user,
      getAuthHeader,
    }),
    [getAuthHeader, logIn, user],
  );

  return (
    <AuthContext.Provider value={authContextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
