import './index.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';

import { AppProvider } from './AppContext'
import App from './App';
// import reportWebVitals from './reportWebVitals';

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

/*
    display: flex;
    flex-direction: column;
    justify-content: space-between;
*/
root.render(
  <React.StrictMode>
    <AppProvider><App /></AppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
