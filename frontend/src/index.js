import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import './index.css';
import './css/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import Init from './init.js';

const app = async () => {
  const root = ReactDOM.createRoot(document.querySelector('#root'));
  const socket = io();
  const vdom = await Init(socket);
  root.render(vdom);
};

app();
