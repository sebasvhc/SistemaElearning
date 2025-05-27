// src/routes/Router.jsx
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import { PrivateRoute } from '../components/PrivateRoute'

export const Router = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />
      
      {/* Ruta protegida */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
      {/* Ruta por defecto (redirección) */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}