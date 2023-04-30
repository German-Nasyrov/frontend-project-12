import { useMemo, useCallback } from 'react';
import ApiContext from '../contexts/ApiContext.jsx';

const ApiProvider = ({ socket, children }) => {
  const sendMessage = useCallback((payload) => new Promise((resolve, reject) => {
    socket.emit('newMessage', payload, (response) => {
      if (response.status === 'ok') {
        resolve(response.data);
      } else {
        reject(response.error);
      }
    });
  }), [socket]);

  const sendChannel = useCallback((payload) => new Promise((resolve, reject) => {
    socket.emit('newChannel', payload, (response) => {
      if (response.status === 'ok') {
        resolve(response.data);
      } else {
        reject(response.error);
      }
    });
  }), [socket]);

  const sendRemovedChannel = useCallback((payload) => new Promise((resolve, reject) => {
    socket.emit('removeChannel', payload, (response) => {
      if (response.status === 'ok') {
        resolve(response.data);
      } else {
        reject(response.error);
      }
    });
  }), [socket]);

  const sendRenamedChannel = useCallback((payload) => new Promise((resolve, reject) => {
    socket.emit('renameChannel', payload, (response) => {
      if (response.status === 'ok') {
        resolve(response.data);
      } else {
        reject(response.error);
      }
    });
  }), [socket]);

  const providedData = useMemo(() => ({
    sendMessage,
    sendChannel,
    sendRemovedChannel,
    sendRenamedChannel,
  }), [
    sendMessage,
    sendChannel,
    sendRemovedChannel,
    sendRenamedChannel]);

  return (
    <ApiContext.Provider value={providedData}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
