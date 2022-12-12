import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useApi, useAuth } from '../hooks';
import { getCurrentChannel } from '../selectors';

const NewMessageForm = () => {
  const inputMessageRef = useRef();
  useEffect(() => {
    inputMessageRef.current.focus();
  });

  const currentChannel = useSelector(getCurrentChannel);
  const { user } = useAuth();
  const api = useApi();
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: {
      messageText: '',
    },
    onSubmit: async (values, { resetForm }) => {
      api.sendMessage({
        channelId: currentChannel,
        user: user.username,
        message: values.messageText,
      });
      resetForm();
    },
  });

  return (
    <div className="mt-auto px-5 py-3">
      <form
        noValidate=""
        className="py-1 border rounded-2"
        onSubmit={formik.handleSubmit}
      >
        <div className="input-group has-validation">
          <input
            ref={inputMessageRef}
            name="messageText"
            aria-label="Новое сообщение"
            placeholder={t('chatBox.messageFieldPlaceholder')}
            className="border-0 p-0 ps-2 form-control"
            value={formik.values.messageText}
            onChange={formik.handleChange}
          />
          <button
            type="submit"
            className="btn btn-group-vertical"
            disabled={formik.values.messageText === '' || formik.isSubmitting}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width={20}
              height={20}
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
              />
            </svg>
            <span className="visually-hidden">
              {t('chatBox.sendMessageButton')}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewMessageForm;
