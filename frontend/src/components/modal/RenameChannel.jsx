import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useNetwork from '../../hooks/NetworkHook.jsx';
import useSocket from '../../hooks/ApiHook.jsx';
import { channelNameSchema } from '../../schemas/schemas.js';

const RenameChannel = ({ onHide, modalInfo }) => {
  const network = useNetwork();
  const chatApi = useSocket();
  const inputRef = useRef();
  const channels = useSelector((state) => state.channels.allChannels);
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      newChannelName: modalInfo.item.name,
      channelId: modalInfo.item.id,
      channelRemovable: modalInfo.item.removable,
    },
    validationSchema: channelNameSchema(channels),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      const newData = {
        name: formik.values.newChannelName,
        id: formik.values.channelId,
        removable: formik.values.channelRemovable,
      };
      chatApi.sendAction('renameChannel', newData)
        .then(() => {
          toast.success(t('channels.renamed'));
          onHide();
        })
        .catch(() => toast.danger(t('errors.toastifyRename')));
    },
  });

  useEffect(() => { inputRef.current.select(); }, []);

  return (
    <Modal centered show>
      <Modal.Header onHide={onHide} closeButton>
        <Modal.Title className="p-1">{t('modals.rename')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              required
              className={`mb-2 form-control ${formik.errors.newChannelName ? 'is-invalid' : ''}`}
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={network.isOnline ? formik.values.newChannelName : t('errors.network')}
              autoComplete="off"
              data-testid="input-body"
              id="newChannelName"
              name="newChannelName"
            />
            <Form.Label className="visually-hidden" htmlFor="newChannelName">{t('modals.channelName')}</Form.Label>
            {formik.touched.newChannelName && formik.errors.newChannelName && (
              <div className="mb-2 invalid-feedback">{t(formik.errors.newChannelName)}</div>
            )}
          </Form.Group>
          <Form.Group className="justify-content-start d-flex mt-3">
            <Button variant={network.isOnline ? 'primary' : 'danger'} disabled={!network.isOnline} type="submit">{t('modals.submit')}</Button>
            <Button className="ms-2" type="button" variant="secondary" onClick={() => onHide()}>{t('modals.cancel')}</Button>
          </Form.Group>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
