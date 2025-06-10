import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from '../components/PrivateRoute';
import HomePage from '../pages/HomePage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import StudentDashboard from '../pages/Dashboard/StudentDashboard/StudentDashboard';
import TeacherDashboard from '../pages/Dashboard/TeacherDashboard/TeacherDashboard';
import NotFound from '../pages/errors/NotFound';
import Unauthorized from '../pages/errors/Unauthorized';


export default function AppRoutes() {
  const { user } = useAuth(); // Ahora usamos el user completo

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Redirección automática post-login */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            {user?.role === 'teacher' ? (
              <Navigate to="/teacher-dashboard" replace />
            ) : (
              <Navigate to="/student-dashboard" replace />
            )}
          </PrivateRoute>
        } 
      />

      {/* Rutas protegidas */}
      <Route
        path="/student-dashboard"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/teacher-dashboard"
        element={
          <PrivateRoute allowedRoles={['teacher', 'admin']}>
            <TeacherDashboard />
          </PrivateRoute>
        }
      />

      {/* Rutas de error */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}