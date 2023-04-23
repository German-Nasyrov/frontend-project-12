import { useContext } from 'react';
import AuthorizationContext from '../contexts/AuthorizationContext';

const useAuthorization = () => useContext(AuthorizationContext);

export default useAuthorization;
