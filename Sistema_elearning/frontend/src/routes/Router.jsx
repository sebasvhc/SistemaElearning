// src/routes/Router.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import { PrivateRoute } from '../components/PrivateRoute';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      
      {/* Ruta protegida */}
      <Route 
        path="/dashboard/*"  // El /* permite rutas anidadas
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
      {/* Redirecciones */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};