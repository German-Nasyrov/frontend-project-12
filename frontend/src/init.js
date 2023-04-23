import React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import resources from './locales/index';
import App from './App';
import './index.css';

const Init = () => {
  i18next.use(initReactI18next).init({
    debug: true,
    lng: 'ru',
    resources,
  });

  return (
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  );
};

export default Init;
