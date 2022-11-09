import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentChannel, setInitialState,
} from "../slices/channelsSlice";
import { useMessageApi } from "../hooks";
import ComponentWrapper from "./ComponentWrapper";
import { useState } from "react";
import getModal from "./modals/index";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const renderModal = (modalInfo, hideModal) => {
  if (!modalInfo.type) return null;
  const Component = getModal(modalInfo.type);
  return <Component hideModal={hideModal} modalInfo={modalInfo} />;
};

const renderMessage = (mes) => {
  const { message, user, id } = mes;
  return (
    <div className="text-break mb-2 float-left" key={id}>
      <b>{user}</b>: {message}
    </div>
  );
};

const Chat = () => {
  const currentChannel = useSelector(
    (state) => state.channels.currentChannel
  );
  const dispatch = useDispatch();
  const api = useMessageApi();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await api.fetchData();
        dispatch(setInitialState(data));
      } catch (e) {
        navigate("/login");
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
      <ToastContainer />
    </ComponentWrapper>
  );
};

const ChannelsBox = ({ currentChannel, setCurrentChannel }) => {
  const { t } = useTranslation();
  const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  const dispatch = useDispatch();

  const renderChannel = (channel) => {
    const handleRenameChannel = async (e) => {
      e.preventDefault();
      setModalInfo({ type: "renameChannel", item: channel });
    };

    const handleRemoveChannel = async (e) => {
      e.preventDefault();
      setModalInfo({ type: "removeChannel", item: channel.id });
    };

    const key = channel.id;
    const isActive = currentChannel === channel.id;

    return (
      <li className="nav-item w-100" key={key}>
        {channel.removable ? (
          <Dropdown
            as={ButtonGroup}
            className="d-flex"
            align="start"
            autoClose
            navbar
          >
            <Button
              variant={isActive ? "secondary" : null}
              className="w-100 rounded-0 text-start text-truncate"
              onClick={() => {
                dispatch(setCurrentChannel(channel.id));
              }}
            >
              <span className="me-1">#</span>
              {channel.name}
            </Button>

            <Dropdown.Toggle
              className="flex-grow-0"
              split
              variant={isActive ? "secondary" : null}
              id="dropdown-split-basic"
            />

            <Dropdown.Menu>
              <Dropdown.Item onClick={handleRemoveChannel}>
                {t("channelBox.removeChannel")}
              </Dropdown.Item>
              <Dropdown.Item onClick={handleRenameChannel}>
                {t("channelBox.renameChannel")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Button
            onClick={() => {
              dispatch(setCurrentChannel(channel.id));
            }}
            className="w-100 rounded-0 text-start"
            variant={isActive ? "secondary" : null}
          >
            <span className="me-1">#</span>
            {channel.name}
          </Button>
        )}
      </li>
    );
  };

  const hideModal = (msg = null) => {
    setModalInfo({ type: null, item: null });
    if (msg) {
      toast(msg);
    } 
  };

  const channels = useSelector((state) => state.channels.channels);
  const handleAddChannel = async (e) => {
    e.preventDefault();
    setModalInfo({ type: "addChannel", item: null });
  };

  return (
    <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>{t("channelBox.channelsHeader")}</span>
        <button
          onClick={handleAddChannel}
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width={20}
            height={20}
            fill="currentColor"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2">
        {channels.map((channel) =>
          renderChannel(channel, currentChannel, setCurrentChannel)
        )}
      </ul>
      {renderModal(modalInfo, hideModal)}
    </div>
  );
};

const ChatBox = ({ currentChannel }) => {
  const {t} = useTranslation()
  const channels = useSelector((state) => state.channels.channels);
  const channel = channels.find((ch) => ch.id === currentChannel);
  const chatBoxRef = useRef();
  const inputMessageRef = useRef();
  const messages = useSelector((state) => state.messages.value);
  const currentChannelMessages = messages.filter(
    (message) => message.channelId === currentChannel
  );
  const user = JSON.parse(localStorage.getItem("user"));
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
  })

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># {channel?.name || null}</b>
          </p>
          <span className="text-muted">
            {t("chatBox.messages.key", {
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
                placeholder={t("chatBox.messageFieldPlaceholder")}
                className="border-0 p-0 ps-2 form-control"
                value={formik.values.messageText}
                onChange={formik.handleChange}
              />
              <button type="submit" className="btn btn-group-vertical" disabled={formik.values.messageText === '' || formik.isSubmitting}>
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
                <span className="visually-hidden">Отправить</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function Home() {
  return <Chat />;
}

export default Home;
