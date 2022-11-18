import React, { useMemo, useCallback } from 'react';
import { Provider } from 'react-redux';
import axios from 'axios';
import { I18nextProvider } from 'react-i18next';
import filter from 'leo-profanity';
import Rollbar from 'rollbar';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import App from './components/App';
import store from './slices';
import { addOne as addMessage } from './slices/messagesSlice';
import { addOne as addChannel, removeChannel, renameChannel } from './slices/channelsSlice';
import MessageIpaContext from './context/massageApi';
import AuthProvider from './components/AuthProvider';
import { useAuth } from './hooks';
import initI18Next from './i18/i18n.js';

filter.add(filter.getDictionary('en'));
filter.add(filter.getDictionary('fr'));
filter.add(filter.getDictionary('ru'));

const init = async (socket) => {
  const rollbarConfig = {
    accessToken: '5d6cc936bb624a6cbe8692f7d18f6352',
    environment: 'production',
    captureUncaught: true,
    captureUnhandledRejections: true,
  };
  const rollbar = new Rollbar(rollbarConfig);

  socket.on('newMessage', (msg) => {
    store.dispatch(addMessage(msg));
  });
  socket.on('newChannel', (chnl) => {
    store.dispatch(addChannel(chnl));
  });
  socket.on('removeChannel', (data) => {
    store.dispatch(removeChannel(data.id));
  });
  socket.on('renameChannel', (chnl) => {
    store.dispatch(renameChannel({ id: chnl.id, name: chnl.name }));
  });

  const MessageApiProvider = ({ children }) => {
    const auth = useAuth();
    const sendMessage = async (messageText, username, currentChannel) => {
      await socket.volatile.emit(
        'newMessage',
        {
          message: messageText,
          user: username,
          channelId: currentChannel,
        },
        (response) => console.log(response.status, response.data),
      );
    };

    const fetchData = useCallback(async () => {
      try {
        const res = await axios.get('/api/v1/data', {
          headers: auth.getAuthHeader(),
        });
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) {
          throw err;
        }
        throw err;
      }
    }, [auth]);

    const addNewChannel = async (channelName) => {
      await socket.volatile.emit(
        'newChannel',
        {
          name: channelName,
        },
        (response) => console.log(response.status, response.data),
      );
    };

    const renameChnl = async (name, id) => {
      await socket.volatile.emit(
        'renameChannel',
        {
          name,
          id,
        },
        (response) => console.log(response.status, response.data),
      );
    };

    const removeChnl = async (id) => {
      await socket.volatile.emit(
        'removeChannel',
        {
          id,
        },
        (response) => console.log(response.status, response.data),
      );
    };

    const ipaContextValues = useMemo(() => ({
      sendMessage,
      fetchData,
      addNewChannel,
      renameChannel: renameChnl,
      removeChannel: removeChnl,
      filter,
    }), [fetchData]);

    return (
      <MessageIpaContext.Provider value={ipaContextValues}>
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
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </I18nextProvider>
          </MessageApiProvider>
        </AuthProvider>
      </Provider>
    </RollbarProvider>
  );
};

export default init;
