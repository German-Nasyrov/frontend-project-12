import { React } from 'react';
import {
  Routes, Route, Navigate, Outlet,
} from 'react-router-dom';
import useAuthorization from '../hooks/AuthorizationHook.jsx';
import Navbar from './Navbar.jsx';
import LoginPage from './LoginPage.jsx';
import ChatPage from './ChatPage.jsx';
import SignUpPage from './SignUpPage.jsx';
import PageNotFound from './PageNotFound.jsx';
import routes from '../routes/routes.js';

const PrivateOutlet = () => {
  const authorization = useAuthorization();
  return authorization.user ? <Outlet /> : <Navigate to={routes.loginPagePath()} />;
};

const MainPage = () => (
  <div className="d-flex flex-column h-100">
    <Navbar />
    <Routes>
      <Route path={routes.loginPagePath()} element={<LoginPage />} />
      <Route path={routes.signupPagePath()} element={<SignUpPage />} />
      <Route path={routes.chatPagePath()} element={<PrivateOutlet />}>
        <Route path="" element={<ChatPage />} />
      </Route>
      <Route path={routes.pageNotFoundPath()} element={<PageNotFound />} />
    </Routes>
  </div>
);

export default MainPage;
