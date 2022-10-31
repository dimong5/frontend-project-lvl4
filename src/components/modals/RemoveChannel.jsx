import { Modal, Form, Button } from "react-bootstrap";
import { useMessageApi } from "../../hooks";
import { useTranslation } from "react-i18next";

const RemoveChannel = ({ hideModal, modalInfo }) => {
  const { t } = useTranslation();
  const id  = modalInfo.item;
  const api = useMessageApi();

  const handleSubmit = () => {
    api.removeChannel(id);
    hideModal();
  }

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
        <p className="lead">Уверены?</p>
        <Form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-end">
            <Button
              type="button"
              className="me-2"
              onClick={hideModal}
              variant="secondary"
            >
              Отменить
            </Button>
            <Button type="submit" variant="danger">
              Удалить
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
