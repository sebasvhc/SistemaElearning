import { useEffect, useState } from 'react';
import { fetchCourses } from '../api/courses';

function Dashboard() {
  const [courses, setCourses] = useState([]);

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
      {courses.map(course => (
        <div key={course.id} className="border p-4 mb-4 rounded-lg">
          <h3 className="text-xl font-bold">{course.title}</h3>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
}