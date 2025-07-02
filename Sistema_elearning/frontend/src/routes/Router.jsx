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
import StudentQuiz from '../pages/Dashboard/StudentDashboard/StudentQuiz';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

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

      {/* Rutas de estudiante */}
      <Route
        path="/student-dashboard"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/student-dashboard/quiz/:quizId"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentQuiz />
          </PrivateRoute>
        }
      />
      
      {/* <Route
        path="/student-dashboard/course/:courseId"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <CourseDetails /> 
          </PrivateRoute>
        }
      /> */}

      {/* Rutas de profesor */}
      <Route
        path="/teacher-dashboard"
        element={
          <PrivateRoute allowedRoles={['teacher', 'admin']}>
            <TeacherDashboard />
          </PrivateRoute>
        }
      />

      {/* Rutas de error - debe ser la última */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}