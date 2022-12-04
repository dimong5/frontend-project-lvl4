import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useApi } from '../../hooks';
import { getModalState } from '../../selectors';
import { hideModal } from '../../slices/modalSlice';

const RemoveChannel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const id = useSelector(getModalState()).item;
  const api = useApi();

  const handleSubmit = () => {
    api.removeChannel({ id });
    dispatch(hideModal());
    toast.success(t('alertMessage.channelRemoved'));
  };

  return (
    <Modal
      show="true"
      onHide={() => dispatch(hideModal())}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          {t('removeChannelModal.addChannelFormHeader')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('removeChannelModal.areYouSure')}</p>
        <Form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-end">
            <Button
              type="button"
              className="me-2"
              onClick={() => dispatch(hideModal())}
              variant="secondary"
            >
              {t('removeChannelModal.cancelButton')}
            </Button>
            <Button type="submit" variant="danger">
              {t('removeChannelModal.submitButton')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
