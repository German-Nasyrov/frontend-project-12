import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { animateScroll } from 'react-scroll';
import {
  Dropdown, Button, Nav, Col,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { setActiveChannel } from '../slices/channelsSlice.js';
import { onShow } from '../slices/modalsSlice.js';

const RenderChannel = ({
  channel, handleClick, showModal, activeChannelId,
}) => {
  const { t } = useTranslation();
  const { id, name, removable } = channel;
  useEffect(() => {
    animateScroll.scrollToBottom({ containerId: 'channels-box', delay: 0, duration: 0 });
  }, []);

  return (
    removable ? (
      <Nav.Item className="w-100" key={id} data-changecolour="hover">
        <Dropdown role="group" className="d-flex dropdown btn-group">
          <Button
            className={`w-100 rounded-0 text-start text-truncate btn ${activeChannelId === id ? 'btn-secondary' : ''}`}
            type="button"
            id="channel-button-left"
            onClick={() => handleClick(id)}
            data-changecolour="hover"
            variant="white"
          >
            <span className="me-1">#</span>
            {name}
          </Button>
          <Dropdown.Toggle
            split
            type="button"
            variant="white"
            id="channel-button-right"
            data-changecolour="hover"
            className={`flex-grow-0 btn ${activeChannelId === id ? 'btn-secondary' : ''}`}
          >
            <span className="visually-hidden">{t('channels.menu')}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => showModal('removing', { id })}>{t('channels.remove')}</Dropdown.Item>
            <Dropdown.Item onClick={() => showModal('renaming', { id, name, removable })}>{t('channels.rename')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav.Item>
    ) : (
      <Nav.Item className="w-100" key={id} data-changecolour="hover">
        <Button
          onClick={() => handleClick(id)}
          type="button"
          variant="white"
          id="channel-button"
          data-changecolour="hover"
          className={`w-100 rounded-0 text-start btn ${activeChannelId === id ? 'btn-secondary' : ''}`}
        >
          <span className="me-1">#</span>
          {name}
        </Button>
      </Nav.Item>
    )
  );
};

const Channels = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels.allChannels);
  const activeChannelId = useSelector((state) => state.channels.currentActiveId);
  const showModal = (type, item = null) => dispatch(onShow({ type, item }));
  const handleClick = (id) => dispatch(setActiveChannel(id));

  return (
    <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex" id="channels-col">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('channels.channels')}</b>
        <button
          onClick={() => showModal('adding')}
          type="button"
          id="channels-image-plus"
          className="p-0 text-primary btn btn-group-vertical"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">{t('modals.add')}</span>
        </button>
      </div>
      <Nav
        variant="pills"
        fill
        id="channels-box"
        className="flex-column px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels && channels.map((channel) => (
          <RenderChannel
            key={channel.id}
            channel={channel}
            handleClick={handleClick}
            showModal={showModal}
            activeChannelId={activeChannelId}
          />
        ))}
      </Nav>
    </Col>
  );
};

export default Channels;
