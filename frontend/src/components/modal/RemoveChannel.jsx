import React, { useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useNetwork from '../../hooks/NetworkHook.jsx';
import useSocket from '../../hooks/ApiHook.jsx';

const RemoveChannel = ({ onHide, modalInfo }) => {
  const network = useNetwork();
  const chatApi = useSocket();
  const inputRef = useRef();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      removingChannelId: modalInfo.item.id,
    },
    onSubmit: () => {
      chatApi.sendRemovedChannel({ id: formik.values.removingChannelId })
        .then(() => {
          toast.success(t('channels.removed'));
          onHide();
        })
        .catch(() => toast.danger(t('errors.toastifyRemove')));
    },
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title className="p-1">
          {t('modals.remove')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead p-1">
          {network.isOnline
            ? t('modals.confirmation')
            : t('errors.network')}
        </p>
        <form onSubmit={formik.handleSubmit}>
          <div className="d-flex justify-content-start">
            <Button
              ref={inputRef}
              type="submit"
              variant="danger"
              className=""
              disabled={!network.isOnline}
            >
              {t('modals.confirm')}
            </Button>
            <Button
              onClick={() => onHide()}
              type="button"
              variant="secondary"
              className="ms-2"
            >
              {t('modals.cancel')}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
