import {
  Modal, Form, FormGroup, FormControl, Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import React, { useRef, useEffect } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useApi } from '../../hooks';
import { getChannels } from '../../selectors';
import { hideModal } from '../../slices/modalSlice';

const AddChannel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channelNameSchema = Yup.object().shape({
    channelName: Yup.string()
      .trim()
      .required('addChannelModal.required')
      .min(3, 'addChannelModal.nameLength')
      .max(20, 'addChannelModal.nameLength'),
  });
  const api = useApi();
  const input = useRef(null);
  const channels = useSelector(getChannels);
  const isUniq = (name) => channels.findIndex((ch) => ch.name === name) === -1;

  useEffect(() => {
    input.current.focus();
  }, [input]);
  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema: channelNameSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      if (!isUniq(values.channelName)) {
        formik.setErrors({ channelName: t('addChannelModal.mustBeUniq') });
        return;
      }

      api.addNewChannel({ name: values.channelName });
      dispatch(hideModal());
      toast.success(t('alertMessage.channelAdded'));
    },
  });

  return (
    <Modal
      show="true"
      onHide={() => dispatch(hideModal())}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          {t('addChannelModal.addChannelFormHeader')}
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
              {t('addChannelModal.channelNameLabel')}
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
              {t('addChannelModal.cancelButton')}
            </Button>
            <Button type="submit" variant="primary">
              {t('addChannelModal.submitButton')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
