import React from 'react';
import filter from 'leo-profanity';
import i18next from 'i18next';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { ToastContainer as Toaster } from 'react-toastify';
import { addChannel, removeChannel, renameChannel } from './slices/channelsSlice.js';
import { addMessage } from './slices/messagesSlice.js';
import resources from './locales/index.js';
import store from './slices/index.js';
import App from './App.js';

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  payload: { environment: 'production' },
  captureUncaught: true,
  captureUnhandledRejections: true,
};

export default async (socket) => {
  const defaultLanguage = JSON.parse(localStorage.getItem('currentLanguage')) ?? 'ru';
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    debug: true,
    lng: defaultLanguage,
    fallbackLng: 'ru',
    resources,
  });

  filter.add(filter.getDictionary('en'));
  filter.add(filter.getDictionary('ru'));

  socket.on('newMessage', (data) => {
    store.dispatch(addMessage(data));
  });
  socket.on('newChannel', (data) => {
    store.dispatch(addChannel(data));
  });
  socket.on('removeChannel', (data) => {
    store.dispatch(removeChannel(data));
  });
  socket.on('renameChannel', (data) => {
    store.dispatch(renameChannel(data));
  });

  const vdom = (
    <React.StrictMode>
      <BrowserRouter>
        <RollbarProvider config={rollbarConfig}>
          <ErrorBoundary>
            <Provider store={store}>
              <I18nextProvider i18n={i18n}>
                <App socket={socket} />
              </I18nextProvider>
            </Provider>
          </ErrorBoundary>
        </RollbarProvider>
        <Toaster />
      </BrowserRouter>
    </React.StrictMode>
  );

  return vdom;
};
