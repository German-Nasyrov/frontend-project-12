import { useContext } from 'react';
import ApiContext from '../contexts/ApiContext.jsx';

const useSocket = () => useContext(ApiContext);

export default useSocket;
