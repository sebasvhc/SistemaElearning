// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Importa el Router
import App from './App' // Componente padre (opcional)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Envuelve tu app con el Router */}
      <App /> {/* O directamente <Router /> si no usas App.jsx */}
    </BrowserRouter>
  </React.StrictMode>
)