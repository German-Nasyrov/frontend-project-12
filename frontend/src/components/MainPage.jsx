import { React, useState, useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
}
  from 'react-router-dom';
import { ToastContainer as Toaster } from 'react-toastify';
import AuthorizationContext from '../contexts/AuthorizationContext';
import useAuthorization from '../hooks/AuthorizationHook';
import Navbar from './Navbar';
import LoginPage from './LoginPage';
import PageNotFound from './PageNotFound';
import routes from '../routes/routes';

const AuthorizationProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser ? { username: currentUser.username } : null);
  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ username: userData.username });
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const getAuthorizationHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    return userData?.token ? { Authorization: `Bearer ${userData.token}` } : {};
  };

  const props = useMemo(() => ({
    logIn, logOut, getAuthorizationHeader, user,
  }), [user]);

  return (
    <AuthorizationContext.Provider value={props}>
      {children}
    </AuthorizationContext.Provider>
  );
};

const PrivateOutlet = () => {
  const authorization = useAuthorization();
  return authorization.user ? <Outlet /> : <Navigate to={routes.loginPagePath()} />;
};

const MainPage = () => (
  <AuthorizationProvider>
    <BrowserRouter>
      <div className="d-flex flex-column h-100">
        <Navbar />
        <Routes>
          <Route path={routes.loginPagePath()} element={<LoginPage />} />
          <Route path={routes.chatPagePath()} element={<PrivateOutlet />} />
          <Route path={routes.pageNotFoundPath()} element={<PageNotFound />} />
        </Routes>
      </div>
      <Toaster />
    </BrowserRouter>
  </AuthorizationProvider>
);

export default MainPage;
