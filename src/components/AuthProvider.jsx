import { useState, useMemo } from 'react';
import axios from 'axios';
import AuthContext from '../context';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(
    currentUser ? { username: currentUser.username } : null,
  );

  const getAuthHeader = () => {
    const { token } = JSON.parse(localStorage.getItem('user'));
    if (user && token) {
      return { Authorization: `Bearer ${token}` };
    }

    return {};
  };

  const logIn = (userObj) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser({ username: userObj.username });
  };
  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const signUp = async (userObj) => axios.post('/api/v1/signup', userObj);

  const authContextValues = useMemo(
    () => ({
      logIn,
      logOut,
      signUp,
      user,
      getAuthHeader,
    }),
  );

  return (
    <AuthContext.Provider value={authContextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
