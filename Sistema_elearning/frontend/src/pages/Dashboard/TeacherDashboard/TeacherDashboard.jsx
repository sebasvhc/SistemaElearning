import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTeacherCourses, handleApiError } from '../../../api/courses';
import Sidebar from '../../../components/teacher/Sidebar';
import Header from '../../../components/teacher/Header';

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTeacherCourses();
        setCourses(data);
      } catch (err) {
        const errorInfo = handleApiError(err);
        console.error('Error loading courses:', errorInfo);
        setError(errorInfo.message);
        
        // Redirigir a login si no está autorizado
        if (errorInfo.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Mis Cursos</h2>
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <p>No tienes cursos asignados</p>
              )}
            </div>
          )}
          
          {/* Otras pestañas */}
        </main>
      </div>
    </div>
  );
}