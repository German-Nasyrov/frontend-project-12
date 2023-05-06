import { useDispatch, useSelector } from 'react-redux';
import { onHide } from '../slices/modalsSlice.js';
import getModal from './modal/index.jsx';

const Modals = () => {
  const dispatch = useDispatch();
  const modalInfo = useSelector((state) => state.modals);
  const hideModal = () => dispatch(onHide({ type: null, item: null }));

  if (!modalInfo.type) return null;

  const Component = getModal(modalInfo.type);
  return <Component modalInfo={modalInfo} onHide={hideModal} />;
};

export default Modals;
