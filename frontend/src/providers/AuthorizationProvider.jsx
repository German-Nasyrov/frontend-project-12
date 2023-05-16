import { useState, useMemo, useCallback } from 'react';
import AuthorizationContext from '../contexts/AuthorizationContext.jsx';

const AuthorizationProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser ? { username: currentUser.username } : null);

  const logIn = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ username: userData.username });
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const getAuthorizationHeader = useCallback(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData?.token ? { Authorization: `Bearer ${userData.token}` } : {};
  }, []);

  const getUserInfo = useCallback(() => user, [user]);

  const providedData = useMemo(() => ({
    user,
    logIn,
    logOut,
    getAuthorizationHeader,
    getUserInfo,
  }), [user, logIn, logOut, getAuthorizationHeader, getUserInfo]);

  return (
    <AuthorizationContext.Provider value={providedData}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationProvider;
