import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import filter from 'leo-profanity';
import Rollbar from 'rollbar';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import App from './components/App';
import store from './slices';
import { addMessage } from './slices/messagesSlice';
import {
  addChannel, removeChannel, renameChannel,
} from './slices/channelsSlice';
import { ApiContext } from './context';
import AuthProvider from './components/AuthProvider';
import initI18Next from './i18next/i18n.js';

const init = async (socket) => {
  filter.add(filter.getDictionary('en'));
  filter.add(filter.getDictionary('ru'));

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

  const ApiProvider = ({ children }) => {
    const withAcknowledgement = (socketFunc) => (...args) => new Promise((resolve, reject) => {
      let state = 'pending'; // eslint-disable-line
      const timer = setTimeout(() => {
        state = 'rejected';
        reject();
      }, 3000);
      socketFunc(...args, (response) => {
        if (state !== 'pending') return;
        clearTimeout(timer);
        if (response.status === 'ok') {
          state = 'resolved';
          resolve(response.data);
        }
        reject();
      });
    });

    const sendMessage = withAcknowledgement((...args) => socket.volatile.emit('newMessage', ...args));
    const addNewChannel = withAcknowledgement((...args) => socket.volatile.emit('newChannel', ...args));
    const renameChnl = withAcknowledgement((...args) => socket.volatile.emit('renameChannel', ...args));
    const removeChnl = withAcknowledgement((...args) => socket.volatile.emit('removeChannel', ...args));

    const ipaContextValues = useMemo(() => ({
      sendMessage,
      addNewChannel,
      renameChannel: renameChnl,
      removeChannel: removeChnl,
      filter,
    }), [addNewChannel, removeChnl, renameChnl, sendMessage]);

    return (
      <ApiContext.Provider value={ipaContextValues}>
        {children}
      </ApiContext.Provider>
    );
  };

  return (
    <RollbarProvider instance={rollbar}>
      <Provider store={store}>
        <AuthProvider>
          <ApiProvider>
            <I18nextProvider i18n={await initI18Next()}>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </I18nextProvider>
          </ApiProvider>
        </AuthProvider>
      </Provider>
    </RollbarProvider>
  );
};

export default init;
