import { useContext } from 'react';
import AuthorizationContext from '../contexts/AuthorizationContext.jsx';

const useAuthorization = () => useContext(AuthorizationContext);

export default useAuthorization;
