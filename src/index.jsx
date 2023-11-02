import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app/App.jsx'
import './index.css'
/****************PrimeReact*****************/
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import "../node_modules/primeflex/primeflex.css";
/****************PrimeReact*****************/
import '@fortawesome/fontawesome-free/css/all.min.css';

/*ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>,
)*/
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>
);

//https://forum.primefaces.org/viewtopic.php?p=198943#p198943