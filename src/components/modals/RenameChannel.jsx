import {
  Modal, Form, FormGroup, FormControl, Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import React, { useRef, useEffect } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useApi } from '../../hooks';
import { getChannels, getModalState } from '../../selectors';
import { hideModal } from '../../slices/modalSlice';

const RenameChannel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channelNameSchema = Yup.object().shape({
    channelName: Yup.string()
      .trim()
      .required('renameChannelModal.required')
      .min(3, 'renameChannelModal.nameLength')
      .max(20, 'renameChannelModal.nameLength'),
  });
  const api = useApi();
  const { item } = useSelector(getModalState);
  const { name: currentName, id } = item;
  const input = useRef(null);
  const channels = useSelector(getChannels);
  const isUniq = (name) => channels.findIndex((ch) => ch.name === name) === -1;

  useEffect(() => {
    input.current.focus();
    input.current.select();
  }, [input]);
  const formik = useFormik({
    initialValues: {
      channelName: currentName,
    },
    validationSchema: channelNameSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (!isUniq(values.channelName)) {
        formik.setErrors({ channelName: t('renameChannelModal.mustBeUniq') });
        return;
      }
      await api.renameChannel({ name: values.channelName, id });
      dispatch(hideModal());
      toast.success(t('alertMessage.channelRenamed'));
    },
  });

  return (
    <Modal
      show="true"
      onHide={() => hideModal()}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          {t('renameChannelModal.renameChannelFormHeader')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              id="channelName"
              name="channelName"
              className="mb-2"
              onChange={formik.handleChange}
              value={formik.values.channelName}
              onBlur={formik.handleBlur}
              ref={input}
              isInvalid={
                formik.errors.channelName && formik.touched.channelName
              }
            />
            <Form.Label className="visually-hidden" htmlFor="channelName">
              {t('renameChannelModal.channelNameLabel')}
            </Form.Label>
            <FormControl.Feedback type="invalid">
              {t(formik.errors.channelName)}
            </FormControl.Feedback>
          </FormGroup>
          <div className="d-flex justify-content-end">
            <Button
              type="button"
              className="me-2"
              onClick={() => dispatch(hideModal())}
              variant="secondary"
            >
              {t('renameChannelModal.cancelButton')}
            </Button>
            <Button type="submit" variant="primary">
              {t('renameChannelModal.submitButton')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
