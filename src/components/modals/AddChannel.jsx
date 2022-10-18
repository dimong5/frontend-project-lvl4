import { Modal, Form, FormGroup, FormControl, Button } from 'react-bootstrap'
import { useFormik } from 'formik';
import { useMessageApi } from '../../hooks';
import { useRef, useEffect } from 'react';
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';


const AddChannel = ({ hideModal }) => {
  const { t } = useTranslation();
  const channelNameSchema = Yup.object().shape({
    channelName: Yup.string()
      .min(3, "validationErrors.nameSize")
      .max(20, "validationErrors.nameSize")
      .required("validationErrors.required"),
  });
  const api = useMessageApi();
  const input = useRef(null);
  const channels = useSelector((state) => state.channels.value.channels);
  const isUniq = (name) => {
    return channels.findIndex((ch) => ch.name === name) === -1;
  };

  useEffect(() => {
    input.current.focus();
  }, [input])
   const formik = useFormik({
     initialValues: {
       channelName: '',
     },
     validationSchema: channelNameSchema,
     validateOnBlur: false,
     validateOnChange: false,
     onSubmit: values => {
       if (!isUniq(values.channelName)) {
         formik.setErrors({ channelName: t("validationErrors.mustBeUniq") });
         return;
       }

       api.addNewChannel(values.channelName);
       values.channelName = "";
       hideModal();
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
          Добавить канал
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
            ></FormControl>
            <Form.Label className="visually-hidden" htmlFor="channelName">
              Имя канала
            </Form.Label>
            <FormControl.Feedback type="invalid">
              {t(formik.errors.channelName)}
            </FormControl.Feedback>
          </FormGroup>
          <div className="d-flex justify-content-end">
            <Button
              type="button"
              className="me-2"
              onClick={hideModal}
              variant="secondary"
            >
              Отменить
            </Button>
            <Button type="submit" variant="primary">
              Отправить
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
  
};

export default AddChannel;
