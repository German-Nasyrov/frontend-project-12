import { useContext } from 'react';
import LanguageContext from '../contexts/LanguageContext.jsx';

const useLanguage = () => useContext(LanguageContext);

export default useLanguage;
