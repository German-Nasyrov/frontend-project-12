import {
  useState, useMemo, useCallback,
} from 'react';
import { enable, disable, isEnabled as isDarkReaderEnabled } from 'darkreader';
import DarkModeContext from '../contexts/DarkModeContext.jsx';

const DarkModeProvider = ({ children }) => {
  const [isDarkModeEnabled, setValueOfDarkMode] = useState(false);

  const switchDarkModeValue = useCallback(() => {
    const darkModeParams = { brightness: 100, contrast: 90, sepia: 10 };
    const isEnabled = isDarkReaderEnabled();
    switch (isEnabled) {
      case true:
        disable();
        setValueOfDarkMode(false);
        break;
      case false:
        enable(darkModeParams);
        setValueOfDarkMode(true);
        break;
      default:
        disable();
        setValueOfDarkMode(false);
        break;
    }
  }, []);

  const providedData = useMemo(() => ({
    isDarkModeEnabled, setValueOfDarkMode, switchDarkModeValue,
  }), [isDarkModeEnabled, setValueOfDarkMode, switchDarkModeValue]);

  return (
    <DarkModeContext.Provider value={providedData}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeProvider;
