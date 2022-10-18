import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import App from "./components/App";
import store from "./slices";
import { addOne as addMessage } from "./slices/messagesSlice";
import { addOne as addChannel, removeChannel, renameChannel, setCurrentChannel } from "./slices/channelsSlice";
import MessageIpaContext from "./context/massageApi";
import axios from "axios";
import AuthProvider from "./components/AuthProvider";
import { useAuth } from "./hooks";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import resources from './locales';
import initI18Next from "./i18/i18n.js";


//import i18n from "./i18/i18n";

const init = async (socket) => {
  //console.log(initI18Next())
  // const i18init = async () => {
  //   const i18n = i18next.createInstance();
  //   await i18n.use(initReactI18next).init({
  //     resources,
  //     fallbackLng: "ru",
  //   });
  //   //console.log(i18n)
  //   return i18n;
  // };
    
 

  socket.on('newMessage', (msg) => {
      
      store.dispatch(addMessage(msg))
    })
    socket.on("newChannel", (chnl) => {
      store.dispatch(addChannel(chnl));
      store.dispatch(setCurrentChannel(chnl.id));
    });
    socket.on("removeChannel", (data) => {
      store.dispatch(removeChannel(data.id));
      store.dispatch(setCurrentChannel(1));
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
            const res = await axios.get("http://localhost:3000/api/v1/data", {
              headers: auth.getAuthHeader(),
            });
            //async
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
          <MessageIpaContext.Provider value={{ sendMessage, fetchData, addNewChannel, renameChannel, removeChannel }}>
            {children}
          </MessageIpaContext.Provider>
        );
      };
    
  return (
    <Provider store={store}>
      <AuthProvider>
        <MessageApiProvider>
          <I18nextProvider i18n={await initI18Next()}>
            <App />
          </I18nextProvider>
        </MessageApiProvider>
      </AuthProvider>
    </Provider>
  );
};

export default init;
