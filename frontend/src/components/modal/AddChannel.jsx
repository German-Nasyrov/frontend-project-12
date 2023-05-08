import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useNetwork from '../../hooks/NetworkHook.jsx';
import useAuthorization from '../../hooks/AuthorizationHook.jsx';
import { setActiveChannel } from '../../slices/channelsSlice.js';
import useSocket from '../../hooks/ApiHook.jsx';
import { channelNameSchema } from '../../schemas/schemas.js';

const AddChannel = ({ onHide }) => {
  const network = useNetwork();
  const chatApi = useSocket();
  const authorization = useAuthorization();
  const dispatch = useDispatch();
  const inputRef = useRef();
  const channels = useSelector((state) => state.channels.allChannels);
  const { username } = authorization.getUserInfo();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: { newChannelName: '', channelId: _.uniqueId() },
    validationSchema: channelNameSchema(channels),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      chatApi.sendAction('newChannel', { name: formik.values.newChannelName, author: username })
        .then((data) => {
          dispatch(setActiveChannel(data.id));
          toast.success(t('channels.created'));
          onHide();
        })
        .catch(() => toast.error(t('errors.toastifyAdd')));
    },
  });

  useEffect(() => inputRef.current.focus(), []);

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title className="p-1">{t('modals.add')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Form.Group>
            <Form.Control
              required
              className={`mb-2 form-control ${formik.errors.newChannelName ? 'is-invalid' : ''}`}
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={network.isOnline ? formik.values.newChannelName : t('errors.network')}
              data-testid="input-body"
              autoComplete="off"
              id="newChannelName"
              name="newChannelName"
            />
            <Form.Label className="visually-hidden" htmlFor="newChannelName">{t('modals.channelName')}</Form.Label>
            {formik.touched.newChannelName && formik.errors.newChannelName && (
            <div className="invalid-feedback mb-2">
              {t(formik.errors.newChannelName)}
            </div>
            )}
          </Form.Group>
          <Form.Group className="d-flex justify-content-start mt-3">
            <Button type="submit" variant={network.isOnline ? 'primary' : 'danger'} disabled={!network.isOnline}>{t('modals.submit')}</Button>
            <Button onClick={() => onHide()} type="button" variant="secondary" className="ms-2">{t('modals.cancel')}</Button>
          </Form.Group>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
