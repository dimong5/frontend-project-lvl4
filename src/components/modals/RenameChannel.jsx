import { Modal, Form, FormGroup, FormControl, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { useMessageApi } from "../../hooks";
import { useRef, useEffect } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const RenameChannel = ({ hideModal, modalInfo }) => {
  const { t } = useTranslation();
  const channelNameSchema = Yup.object().shape({
    channelName: Yup.string()
      .trim()
      .required("renameChannelModal.required")
      .min(3, "renameChannelModal.nameLength")
      .max(20, "renameChannelModal.nameLength"),
  });
  const api = useMessageApi();
  const currentName = modalInfo.item.name;
  const input = useRef(null);
  const channels = useSelector((state) => state.channels.channels);
  const isUniq = (name) => {
    return channels.findIndex((ch) => ch.name === name) === -1;
  };

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
    onSubmit: (values) => {
      if (!isUniq(values.channelName)) {
        formik.setErrors({ channelName: t("renameChannelModal.mustBeUniq") });
        return;
      }
      api.renameChannel(values.channelName, modalInfo.item.id);
      values.channelName = "";
      hideModal(t("alertMessage.channelRenamed"));
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
          {t("renameChannelModal.renameChannelFormHeader")}
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
              {t("renameChannelModal.cancelButton")}
            </Button>
            <Button type="submit" variant="primary">
              {t("renameChannelModal.submitButton")}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
