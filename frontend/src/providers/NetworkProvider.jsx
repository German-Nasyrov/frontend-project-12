import { useState, useMemo, useCallback } from 'react';
import NetworkContext from '../contexts/NetworkContext.jsx';

const NetworkProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  const handleNetworkChange = useCallback(() => {
    setIsOnline(window.navigator.onLine);
  }, []);

  const providedData = useMemo(() => ({
    handleNetworkChange,
    isOnline,
  }), [handleNetworkChange, isOnline]);

  return (
    <NetworkContext.Provider value={providedData}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
