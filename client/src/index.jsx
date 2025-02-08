import React from 'react';
import ReactDOMClient from 'react-dom/client';
import AppWithSocket from './App.jsx';

const app = ReactDOMClient.createRoot(document.getElementById("app"));

app.render( 
        <AppWithSocket />
);