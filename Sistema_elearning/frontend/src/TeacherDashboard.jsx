// pages/TeacherDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTeacherCourses } from '../api/courses';
import Sidebar from '../components/teacher/Sidebar';
import Header from '../components/teacher/Header';

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTeacherCourses(); // API específica para profesores
        setCourses(data);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <>
              {activeTab === 'courses' && <CoursesTab courses={courses} />}
              {activeTab === 'students' && <StudentsTab />}
              {activeTab === 'analytics' && <AnalyticsTab />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// Componentes de pestañas (ejemplo básico)
const CoursesTab = ({ courses }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Mis Cursos</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  </div>
);

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {course.lessons_count} lecciones
        </span>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Gestionar
        </button>
      </div>
    </div>
  </div>
);