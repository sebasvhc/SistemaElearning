import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { fetchStudentCourses } from '../../../api/courses';
import Sidebar from '../../../components/student/Sidebar';
import Header from '../../../components/student/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function StudentDashboard() {
  const { user, isAuthenticated, loading: authLoading, verifyAuth } = useAuth();
  const [courses, setCourses] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!authLoading) {
        if (!isAuthenticated) {
          navigate('/login');
          return;
        }

        if (user?.role !== 'student') {
          navigate('/dashboard');
          return;
        }

        try {
          setDataLoading(true);
          const data = await fetchStudentCourses();
          setCourses(data);
          setError(null);
        } catch (err) {
          console.error('Error loading courses:', err);
          if (err.response?.status === 401) {
            await verifyAuth(); // Re-verificar autenticación
          }
          setError('Error al cargar cursos');
        } finally {
          setDataLoading(false);
        }
      }
    };

    loadData();
  }, [authLoading, isAuthenticated, user, navigate, verifyAuth]);

  if (authLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Reintentar
              </button>
            </div>
          )}

          {dataLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">Mis Cursos</h1>
              {/* ... resto del renderizado ... */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}