import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import useNetwork from '../../hooks/NetworkHook.jsx';
import useAuthorization from '../../hooks/AuthorizationHook.jsx';
import { setActiveChannel } from '../../slices/channelsSlice.js';
import useSocket from '../../hooks/ApiHook.jsx';

const AddChannel = ({ onHide }) => {
  const network = useNetwork();
  const chatApi = useSocket();
  const authorization = useAuthorization();
  const dispatch = useDispatch();
  const inputRef = useRef();
  const channels = useSelector((state) => state.channels.allChannels);
  const { username } = authorization.getUserInfo();
  const { t } = useTranslation();

  const channelNameSchema = yup.object().shape({
    channelName: yup
      .string()
      .min(3, 'errors.symbolsLength')
      .max(20, 'errors.symbolsLength')
      .test('is-unique', 'errors.mustBeUnique', (channelName) => !channels.some((channel) => channel.name === channelName))
      .test('no-profanity', 'errors.profanity', (channelName) => !filter.check(channelName))
      .required('errors.requiredField'),
  });

  const formik = useFormik({
    initialValues: {
      channelName: '',
      channelId: _.uniqueId(),
    },
    validationSchema: channelNameSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      chatApi.sendChannel({ name: formik.values.channelName, author: username })
        .then((data) => {
          dispatch(setActiveChannel(data.id));
          toast.success(t('channels.created'));
          onHide();
        })
        .catch(() => toast.error(t('errors.toastifyAdd')));
    },
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

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
              className={`mb-2 form-control ${formik.errors.channelName ? 'is-invalid' : ''}`}
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={network.isOnline ? formik.values.channelName : t('errors.network')}
              data-testid="input-body"
              autoComplete="off"
              id="channelName"
              name="channelName"
            />
            <Form.Label className="visually-hidden" htmlFor="channelName">{t('modals.channelName')}</Form.Label>
            {formik.touched.channelName && formik.errors.channelName && (
            <div className="invalid-feedback mb-2">
              {t(formik.errors.channelName)}
            </div>
            )}
          </Form.Group>
          <Form.Group className="d-flex justify-content-start mt-3">
            <Button type="submit" variant={network.isOnline ? 'primary' : 'danger'} disabled={!network.isOnline}>{t('modals.submit')}</Button>
            <Button onClick={() => onHide()} type="submit" variant="secondary" className="ms-2">{t('modals.cancel')}</Button>
          </Form.Group>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
