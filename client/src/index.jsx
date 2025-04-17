import React from 'react';
import ReactDOMClient from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { SocketProvider } from './context/SocketContext.js';
import { store } from './store/store.js';

const app = ReactDOMClient.createRoot(document.getElementById("app"));

app.render(
  <Provider store={store}>
    <SocketProvider>
      <App />
    </SocketProvider>
  </Provider>
);
