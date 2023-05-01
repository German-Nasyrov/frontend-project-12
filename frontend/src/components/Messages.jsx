import { useRef, useEffect } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Form, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { toast } from 'react-toastify';
import useSocket from '../hooks/ApiHook.jsx';
import useNetwork from '../hooks/NetworkHook.jsx';
import useAuthorization from '../hooks/AuthorizationHook.jsx';

const Messages = () => {
  const network = useNetwork();
  const chatApi = useSocket();
  const authorization = useAuthorization();
  const messageScroll = useRef(null);
  const inputFocus = useRef();
  const { t } = useTranslation();

  const activeChannelId = useSelector((state) => state.channels.currentActiveId);
  const findActiveChannel = useSelector((state) => state.channels.allChannels)
    .filter(({ id }) => id === activeChannelId);
  const [activeChannel] = findActiveChannel;
  const allMessages = useSelector((state) => state.messages.allMessages);
  const filteredMessages = allMessages.filter(
    ({ channelId }) => channelId === activeChannelId,
  );
  const { username } = authorization.getUserInfo();

  const f = useFormik({
    initialValues: {
      currentMessage: '',
    },
    onSubmit: () => {
      const filteredMessage = filter.clean(f.values.currentMessage);
      chatApi.sendMessage({ body: filteredMessage, channelId: activeChannelId, username })
        .then(() => f.resetForm({ currentMessage: '' }))
        .catch(() => toast.error(t('errors.toastifyMessage')));
    },
  });

  const inputClassNames = cn('input-group', {
    'has-validation': f.values.currentMessage.length < 1,
  });

  useEffect(() => {
    messageScroll.current.scrollIntoView(false, { behavior: 'smooth' });
    inputFocus.current.focus();
  }, [filteredMessages]);

  return (
    <Col className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>{`# ${activeChannel ? activeChannel.name : ''}`}</b>
          </p>
          <span className="text-muted">{`${filteredMessages.length} ${t('messages.messagesCounter.messagesCount', { count: filteredMessages.length })}`}</span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {filteredMessages
            && filteredMessages.map((message) => (
              <div className="text-break mb-2" key={_.uniqueId()}>
                <b>{message.username}</b>
                :
                {' '}
                {message.body}
              </div>
            ))}
          <div ref={messageScroll} />
        </div>
        <div className="mt-auto px-5 py-3">
          <Form
            noValidate=""
            className="py-1 border rounded-2"
            onSubmit={f.handleSubmit}
          >
            <Form.Group className={inputClassNames}>
              <Form.Control
                name="currentMessage"
                aria-label={t('messages.placeholder')}
                placeholder={
                  network.isOnline
                    ? t('messages.newMessage')
                    : t('errors.network')
                }
                className="border-0 p-0 ps-2 form-control"
                value={network.isOnline ? f.values.currentMessage : t('errors.network')}
                ref={inputFocus}
                onChange={f.handleChange}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!f.values.currentMessage || !network.isOnline}
                style={{ borderColor: 'white' }}
                className="btn btn-group-vertical"
              >
                <svg
                  xmlns="http:www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                  />
                </svg>
                <span className="visually-hidden">{t('messages.sendMessage')}</span>
              </button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </Col>
  );
};

export default Messages;
