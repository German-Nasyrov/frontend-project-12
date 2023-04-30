import { useContext } from 'react';
import DarkModeContext from '../contexts/DarkModeContext.jsx';

const useDarkMode = () => useContext(DarkModeContext);

export default useDarkMode;
