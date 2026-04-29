import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App.jsx";
import "./index.css";
import { supabase } from "./lib/supabase";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

window.supabase = supabase;