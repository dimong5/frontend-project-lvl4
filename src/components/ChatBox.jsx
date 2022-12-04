import React, { useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useApi } from '../hooks';
import NewMessageForm from './NewMessageForm';
import { getChannels, getMessages } from '../selectors';

import 'react-toastify/dist/ReactToastify.css';

const ChatBox = ({ currentChannel }) => {
  const { filter } = useApi();

  const renderMessage = (mes) => {
    const { message, user, id } = mes;
    return (
      <div className="text-break mb-2 float-left" key={id}>
        <b>{user}</b>
        :
        {filter.clean(message)}
      </div>
    );
  };

  const { t } = useTranslation();
  const channels = useSelector(getChannels());
  const channel = channels.find((ch) => ch.id === currentChannel);
  const chatBoxRef = useRef();
  const messages = useSelector(getMessages());
  const currentChannelMessages = messages.filter(
    (message) => message.channelId === currentChannel,
  );

  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
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
        <NewMessageForm />
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChatBox;
