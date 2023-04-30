import { useContext } from 'react';
import networkContext from '../contexts/NetworkContext.jsx';

const useNetwork = () => useContext(networkContext);

export default useNetwork;
