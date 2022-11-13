import React from "react";
import { Provider } from "react-redux";
import App from "./components/App";
import store from "./slices";
import { addOne as addMessage } from "./slices/messagesSlice";
import { addOne as addChannel, removeChannel, renameChannel } from "./slices/channelsSlice";
import MessageIpaContext from "./context/massageApi";
import axios from "axios";
import AuthProvider from "./components/AuthProvider";
import { useAuth } from "./hooks";
import { I18nextProvider } from "react-i18next";
import initI18Next from "./i18/i18n.js";
import filter from "leo-profanity";
import Rollbar from "rollbar";
import { Provider as RollbarProvider } from '@rollbar/react';


filter.add(filter.getDictionary("en"));
filter.add(filter.getDictionary("fr"));
filter.add(filter.getDictionary("ru"));


const init = async (socket) => {

  const rollbarConfig = {
    accessToken: '5f3b2f7b890d4349a9f95f36a6885fc7',
    environment: 'production',
  };
  const rollbar = new Rollbar(rollbarConfig);

  socket.on('newMessage', (msg) => {
      store.dispatch(addMessage(msg))
    })
    socket.on("newChannel", (chnl) => {
      store.dispatch(addChannel(chnl));
    });
    socket.on("removeChannel", (data) => {
      store.dispatch(removeChannel(data.id));
    });
  socket.on("renameChannel", (chnl) => {
      store.dispatch(renameChannel({id: chnl.id, name: chnl.name}));
    });
    
      const MessageApiProvider = ({ children }) => {
        const auth = useAuth();
        const sendMessage = async (messageText, username, currentChannel) => {
          await socket.volatile.emit(
            "newMessage",
            {
              message: messageText,
              user: username,
              channelId: currentChannel,
            },
            (response) => console.log(response.status, response.data)
          );
        };

        const fetchData = async () => {
          try {
            const res = await axios.get("/api/v1/data", {
              headers: auth.getAuthHeader(),
            });
            return res.data;
          } catch (err) {
            if (err.response?.status === 401) {
              return err;
            }
          }
        };

        const addNewChannel = async (channelName) => {
          await socket.volatile.emit(
            "newChannel",
            {
              name: channelName,
            },
            (response) => console.log(response.status, response.data)
          );
        };

        const renameChannel = async (name, id) => {
          await socket.volatile.emit(
            "renameChannel",
            {
              name: name,
              id: id,
            },
            (response) => console.log(response.status, response.data)
          );
        };

        const removeChannel = async (id) => {
          await socket.volatile.emit(
            "removeChannel",
            {
              id: id,
            },
            (response) => console.log(response.status, response.data)
          );
        }

        return (
          <MessageIpaContext.Provider value={{ sendMessage, fetchData, addNewChannel, renameChannel, removeChannel, filter }}>
            {children}
          </MessageIpaContext.Provider>
        );
      };
    
  return (
    <RollbarProvider instance={rollbar}>
      <Provider store={store}>
        <AuthProvider>
          <MessageApiProvider>
            <I18nextProvider i18n={await initI18Next()}>
              <App />
            </I18nextProvider>
          </MessageApiProvider>
        </AuthProvider>
      </Provider>
    </RollbarProvider>
  );
};

export default init;
