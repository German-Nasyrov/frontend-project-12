import axios from 'axios';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import { addMessages } from '../slices/messagesSlice.js';
import { addChannels, setActiveChannel } from '../slices/channelsSlice.js';
import store from '../slices/index.js';
import routes from '../routes/routes.js';
import useAuthorization from '../hooks/AuthorizationHook.jsx';

const ChatPage = () => {
  const { t } = useTranslation();
  const auth = useAuthorization();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      axios.get(routes.dataPath(), {
        headers: {
          Authorization: `Bearer ${auth.getUserInfo().token}`,
        },
      }).then((responce) => {
        const { channels, messages, currentChannelId } = responce.data;
        const findCurrentChannel = channels.filter((channel) => channel.id === currentChannelId);
        const [currentActiveChannel] = findCurrentChannel;
        store.dispatch(setActiveChannel(currentActiveChannel.id));
        store.dispatch(addChannels(channels));
        store.dispatch(addMessages(messages));
      }).catch((err) => {
        switch (err.status) {
          case 401:
            auth.logOut();
            break;
          default:
            toast.danger(t('errors.loadData'));
            setTimeout(() => getData(), 5000);
            break;
        }
      });
    };
    getData();
  }, [t, auth, navigate]);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </div>
    </div>
  );
};

export default ChatPage;
