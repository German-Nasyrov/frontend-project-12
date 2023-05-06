import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import useNetwork from '../../hooks/NetworkHook.jsx';
import useSocket from '../../hooks/ApiHook.jsx';

const RenameChannel = ({ onHide, modalInfo }) => {
  const network = useNetwork();
  const chatApi = useSocket();
  const inputRef = useRef();
  const channels = useSelector((state) => state.channels.allChannels);
  const { t } = useTranslation();

  const channelRenameSchema = yup.object().shape({
    newChannelName: yup
      .string()
      .min(3, 'errors.symbolsLength')
      .max(20, 'errors.symbolsLength')
      .test('is-unique', 'errors.mustBeUnique', (newChannelName) => !channels.some((channel) => channel.name === newChannelName))
      .test('no-profanity', 'errors.profanity', (channelName) => !filter.check(channelName))
      .required('errors.requiredField'),
  });

  const formik = useFormik({
    initialValues: {
      newChannelName: modalInfo.item.name,
      channelId: modalInfo.item.id,
      channelRemovable: modalInfo.item.removable,
    },
    validationSchema: channelRenameSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      const newData = {
        name: formik.values.newChannelName,
        id: formik.values.channelId,
        removable: formik.values.channelRemovable,
      };
      chatApi.sendRenamedChannel(newData)
        .then(() => {
          toast.success(t('channels.renamed'));
          onHide();
        })
        .catch(() => toast.danger(t('errors.toastifyRename')));
    },
  });

  useEffect(() => {
    inputRef.current.select();
  }, []);

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title className="p-1">{t('modals.rename')}</Modal.Title>
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
              autoComplete="off"
              data-testid="input-body"
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
            <Button onClick={() => onHide()} type="submit" variant="secondary" className="ms-2">{t('modals.cancel')}</Button>
          </Form.Group>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
