import React from 'react';

import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { defineCustomElements as jeepSqlite, applyPolyfills, JSX as LocalJSX } from "jeep-sqlite/loader";
import { HTMLAttributes } from 'react';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
//import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';

type StencilToReact<T> = {
  [P in keyof T]?: T[P] & Omit<HTMLAttributes<Element>, 'className'> & {
    class?: string;
  };
};

declare global {
  export namespace JSX {
    interface IntrinsicElements extends StencilToReact<LocalJSX.IntrinsicElements> {
    }
  }
}

applyPolyfills().then(() => {
  jeepSqlite(window);
});
window.addEventListener('DOMContentLoaded', async () => {
  
  const platform = Capacitor.getPlatform();
  const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)
  try {
    if (platform === "web") {
      
      const jeepEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepEl);
      await customElements.whenDefined('jeep-sqlite');
      await sqlite.initWebStore();
    }
    
     const container = document.getElementById('root');
     const root = createRoot(container!);
     root.render(
       <React.StrictMode>
         <App />
       </React.StrictMode>
     );
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://cra.link/PWA
    serviceWorkerRegistration.unregister();

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
  } catch (err) {
    
    throw new Error(`Error: ${err}`)
  }
});
