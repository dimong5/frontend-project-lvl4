import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addMany } from "../slices/channelsSlice";
import { addMany as addMessages, addOne as addMessage } from "../slices/messagesSlice";
import useAuth from "../hooks";
import axios from "axios";
import ComponentWrapper from "./ComponentWrapper";
import { useState } from "react";
import { socket } from "../socket";

const getToken = () => { 
  if (localStorage.getItem("user") !== null) {
    return JSON.parse(localStorage.getItem("user")).token;
  }
  return null;
}

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }

  return {};
};

const renderChannel = (channel, currentChannel, setCurrentChannel) => {
  const key = channel.id;
  const active = currentChannel === channel.id ? 'btn-secondary' : null;
  const classString = `w-100 rounded-0 text-start btn ${active}`;
  return (
    <li className="nav-item w-100" key={key}>
      <button
        onClick={() => setCurrentChannel(channel.id)}
        type="button"
        className={classString}
      >
        <span className="me-1">#</span>
        {channel.name}
      </button>
    </li>
  );
};

const renderMessage = (mes) => {
  const { message, user, id } = mes;
  return (
    <div className="text-break mb-2 float-left" key={id}>
      <b>{user}</b>: {message}
    </div>
  );
}

const Chat = () => {
  const [currentChannel, setCurrentChannel] = useState(1);
  const dispatch = useDispatch();  

  
  useEffect(() => {
        const getChannels = async () => {
          try {
            const response = await axios.get(
              "http://localhost:3000/api/v1/data",
              {
                headers: getAuthHeader(),
              }
            );
            dispatch(addMany(response.data.channels));
            dispatch(addMessages(response.data.messages));
          } catch (e) {
            console.log(e);
          }
        };
    getChannels();
  }, [dispatch]);
    
  const channels = useSelector((state) => state.channels.value);

  return (
    <ComponentWrapper>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          {channels.length > 0 ? <ChannelsBox currentChannel={currentChannel} setCurrentChannel={setCurrentChannel} /> : null}
          {channels.length > 0 ? <ChatBox currentChannel={currentChannel} /> : null}
        </div>
      </div>
    </ComponentWrapper>
  );
};

const ChannelsBox = ({currentChannel, setCurrentChannel}) => {
    
  const channels = useSelector((state) => state.channels.value);

    const channel = channels.find((ch) => ch.id === currentChannel);
    console.log("channel", channel, channels);
    console.log("channels", channels);
  return (
    <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>Каналы</span>
        <button
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
    </div>
  );
}


const ChatBox = ({currentChannel}) => {
  const channels = useSelector((state) => state.channels.value);
  const channel = channels.find((ch) => ch.id === currentChannel);
  const chatBoxRef = useRef();
  const inputMessageRef = useRef();
  const dispatch = useDispatch()
  const messages = useSelector((state) => state.messages.value);
  const currentChannelMessages = messages.filter((message) => message.channelId ===currentChannel)
  const [messageText, setMessageText] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
      socket.on("newMessage", (msg) => {
        console.log(msg);
        dispatch(addMessage(msg))
      });
  },[dispatch]);

  useEffect(() => {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        inputMessageRef.current.focus();
  })
  const handleMessageText = (e) => {
    setMessageText(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await socket.volatile.emit(
      "newMessage",
      {
        message: messageText,
        user: user.username,
        channelId: currentChannel,
      },
      (response) => console.log(response.status, response.data)
    );

    const response = await axios.get("http://localhost:3000/api/v1/data", {
      headers: getAuthHeader(),
    });
    console.log(response.data);
    setMessageText("");
  };

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># {channel?.name || null }</b>
          </p>
          <span className="text-muted">{currentChannelMessages.length} сообщений</span>
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
            onSubmit={handleSubmit}
          >
            <div className="input-group has-validation">
              <input
                ref={inputMessageRef}
                name="body"
                aria-label="Новое сообщение"
                placeholder="Введите сообщение..."
                className="border-0 p-0 ps-2 form-control"
                value={messageText}
                onChange={handleMessageText}
              />
              <button
                type="submit"
                disabled=""
                className="btn btn-group-vertical"
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
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return <Chat />;
}

export default Home;
