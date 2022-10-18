import { Modal, Form, FormGroup, FormControl, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { useMessageApi } from "../../hooks";
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const RemoveChannel = ({ hideModal, modalInfo }) => {
  const { t } = useTranslation();
  const id  = modalInfo.item;
  
  const api = useMessageApi();
  const channels = useSelector((state) => state.channels.value.channels);

  const formik = useFormik({
    initialValues: {
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      console.log('id', id)
      api.removeChannel(id);
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
          Удалить канал
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            
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
              Удалить
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
