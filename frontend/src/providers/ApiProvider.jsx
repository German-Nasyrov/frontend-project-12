import { useMemo, useCallback } from 'react';
import ApiContext from '../contexts/ApiContext.jsx';

const ApiProvider = ({ socket, children }) => {
  const sendAction = useCallback((action, payload) => new Promise((resolve, reject) => {
    socket.emit(action, payload, (response) => {
      if (response.status === 'ok') {
        resolve(response.data);
      } else {
        reject(response.error);
      }
    });
  }), [socket]);

  const providedData = useMemo(() => ({ sendAction }), [sendAction]);

  return (
    <ApiContext.Provider value={providedData}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
