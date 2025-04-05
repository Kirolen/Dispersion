import React from 'react';
import ReactDOMClient from 'react-dom/client';
import AppWithSocket from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './store/store.js';

const app = ReactDOMClient.createRoot(document.getElementById("app"));

app.render( 
  <Provider store={store}>
    <AppWithSocket />
  </Provider>
);
