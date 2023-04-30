import { useState, useMemo, useCallback } from 'react';
import AuthorizationContext from '../contexts/AuthorizationContext.jsx';

const AuthorizationProvider = ({ children }) => {
  const initialState = JSON.parse(localStorage.getItem('userInfo'));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(initialState ?? null);

  const logIn = useCallback((response) => {
    const data = JSON.stringify(response.data);
    localStorage.removeItem('userInfo');
    localStorage.setItem('userInfo', data);
    setUser(JSON.parse(data));
    setIsLoggedIn(true);
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  const getUserInfo = useCallback(() => user, [user]);

  const providedData = useMemo(() => ({
    isLoggedIn,
    logIn,
    logOut,
    getUserInfo,
  }), [isLoggedIn, logIn, logOut, getUserInfo]);

  return (
    <AuthorizationContext.Provider value={providedData}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationProvider;
