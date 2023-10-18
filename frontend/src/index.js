import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import init from './init.js';

const app = async () => {
  const root = ReactDOM.createRoot(document.querySelector('#root'));
  const socket = io();
  const vdom = await init(socket);
  root.render(vdom);
};

app();
