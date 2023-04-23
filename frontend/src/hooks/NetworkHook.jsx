import { useContext } from 'react';
import networkContext from '../contexts/NetworkContext';

const useNetwork = () => useContext(networkContext);

export default useNetwork;
