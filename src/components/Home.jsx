import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { ToastContainer } from 'react-toastify';
import { setCurrentChannel, setInitialState } from '../slices/channelsSlice';
import { useMessageApi } from '../hooks';
import ComponentWrapper from './ComponentWrapper';
import ChannelsBox from './ChannelBox';

import 'react-toastify/dist/ReactToastify.css';

const Chat = () => {
  const currentChannel = useSelector((state) => state.channels.currentChannel);
  const dispatch = useDispatch();
  const api = useMessageApi();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await api.fetchData();
        dispatch(setInitialState(data));
      } catch (e) {
        navigate('/login');
      }
    };
    getData();
  }, [dispatch, navigate, api]);

  const channels = useSelector((state) => state.channels.channels);

  return (
    <ComponentWrapper>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          {channels.length > 0 ? (
            <ChannelsBox
              currentChannel={currentChannel}
              setCurrentChannel={setCurrentChannel}
            />
          ) : null}
          {channels.length > 0 ? (
            <ChatBox currentChannel={currentChannel} />
          ) : null}
        </div>
      </div>

    </ComponentWrapper>
  );
};

const ChatBox = ({ currentChannel }) => {
  const { filter } = useMessageApi();

  const renderMessage = (mes) => {
    const { message, user, id } = mes;
    return (
      <div className="text-break mb-2 float-left" key={id}>
        <b>
          {user}
        </b>
        :
        {filter.clean(message)}
      </div>
    );
  };

  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels.channels);
  const channel = channels.find((ch) => ch.id === currentChannel);
  const chatBoxRef = useRef();
  const inputMessageRef = useRef();
  const messages = useSelector((state) => state.messages.value);
  const currentChannelMessages = messages.filter(
    (message) => message.channelId === currentChannel,
  );
  const user = JSON.parse(localStorage.getItem('user'));
  const api = useMessageApi();

  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    inputMessageRef.current.focus();
  });

  const formik = useFormik({
    initialValues: {
      messageText: '',
    },
    onSubmit: async (values, { resetForm }) => {
      api.sendMessage(values.messageText, user.username, currentChannel);
      resetForm();
    },
  });

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #
              {' '}
              {channel?.name || null}
            </b>
          </p>
          <span className="text-muted">
            {t('chatBox.messages.key', {
              count: currentChannelMessages.length,
            })}
          </span>
        </div>
        <div
          ref={chatBoxRef}
          id="messages-box"
          className="chat-messages overflow-auto px-5"
        >
          {messages
            .filter((message) => message.channelId === currentChannel)
            .map(renderMessage)}
        </div>
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
                disabled={
                  formik.values.messageText === '' || formik.isSubmitting
                }
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
      </div>
      <ToastContainer />
    </div>
  );
};

const Home = () => <Chat />;

export default Home;
