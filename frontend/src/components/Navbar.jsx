/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Button, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import en from '../images/UK.png';
import ru from '../images/RU.png';
import useLanguage from '../hooks/LanguageHook.jsx';
import useAuthorization from '../hooks/AuthorizationHook.jsx';
import useDarkMode from '../hooks/DarkModeHook.jsx';

const Navbar = () => {
  const { t } = useTranslation();
  const { logOut, user } = useAuthorization();
  const language = useLanguage();
  const darkMode = useDarkMode();
  const handleChangeLanguage = () => language.setNewLanguage();
  const handleChangeTheme = () => darkMode.switchDarkModeValue();

  return (
    <BootstrapNavbar bg="white" expand="lg" className="shadow-sm">
      <div className="container">
        <BootstrapNavbar.Brand as={Link} to="/">{t('hexletChat')}</BootstrapNavbar.Brand>
        {!!user && <Button onClick={logOut}>{t('logout')}</Button>}
        <div className="form-check form-switch">
          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{t('darkMode')}</label>
          <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onClick={() => handleChangeTheme()} />
        </div>
        <Button type="button" variant="white" id="language-button" onClick={() => handleChangeLanguage()}>
          <img alt="Change language" src={language.activeLanguage === 'ru' ? en : ru} id="change-lang-img" />
        </Button>
      </div>
    </BootstrapNavbar>
  );
};

export default Navbar;
