import { useEffect, useState } from 'react';
import { fetchCourses } from '../api/courses';
import { Outlet } from 'react-router-dom';

// Cambia esto:
// function Dashboard() {
// Por esto:
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const [courses, setCourses] = useState([]);

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (error) {
        console.error('Failed to load courses:', error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div>
        <h1>Dashboard</h1>
        <Outlet /> {/* Aquí aparecerán las rutas hijas */}
      </div>
      {courses.map(course => (
        <div key={course.id} className="border p-4 mb-4 rounded-lg">
          <h3 className="text-xl font-bold">{course.title}</h3>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
}

// Elimina esto si lo tienes:
// export default Dashboard;