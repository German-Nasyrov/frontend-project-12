import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
}
  from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LoginPage from './LoginPage';
import PageNotFound from './PageNotFound';
import routes from '../routes/routes';

const MainPage = () => {
  const { t } = useTranslation();

  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <Nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                {t('mainPage.secretChat')}
              </a>
            </div>
          </Nav>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={<Navigate to={routes.loginPagePath()} replace />}
              />
              <Route path={routes.loginPagePath()} element={<LoginPage />} />
              <Route path={routes.pageNotFoundPath()} element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
