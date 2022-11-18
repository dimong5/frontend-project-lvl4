import { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import AuthContext from '../context';

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
    localStorage.setItem('user', JSON.stringify(user));
    setUser({ username: userObj.username });
  }, [user]);

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const signUp = async (userObj) => axios.post('/api/v1/signup', userObj);

  const authContextValues = useMemo(() => ({
    logIn,
    logOut,
    signUp,
    user,
    getAuthHeader,
  }), [getAuthHeader, logIn, user]);

  return (
    <AuthContext.Provider value={authContextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
