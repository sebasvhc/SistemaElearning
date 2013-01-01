import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { fetchTeacherCourses, createCourse } from '../../../api/courses';
import Sidebar from '../../../components/teacher/Sidebar';
import Header from '../../../components/teacher/Header';
import QuizForm from './QuizForm';
import { getQuizzesByCourse } from '../../../api/quizzes';

export default function TeacherDashboard() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('my-courses');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showQuizForm, setShowQuizForm] = useState(false);
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [courseTitle, setCourseTitle] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [quizzesLoading, setQuizzesLoading] = useState(false);


    // Cargar cursos al montar el componente
    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                const data = await fetchTeacherCourses();
                setCourses(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user ? .role === 'teacher') {
            loadCourses();
        }
    }, [user]);

    // Crear nuevo curso
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const newCourse = await createCourse({
                title: courseTitle,
                teacher_id: user.id // Asegúrate que user.id sea correcto
            });
            setCourses([...courses, newCourse]);
            setCourseTitle('');
            setShowCourseForm(false);
        } catch (error) {
            console.error("Error detallado:", error.response ? .data);
            setError(error.response ? .data ? .detail || 'Error al crear el curso');
        }
    };

    // Manejar cambio de pestaña
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        if (tabId !== 'quizzes') {
            setShowQuizForm(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
        );
    }

    useEffect(() => {
        const loadQuizzes = async () => {
            if (selectedCourse) {
                try {
                    setQuizzesLoading(true);
                    const data = await getQuizzesByCourse(selectedCourse.id);
                    setQuizzes(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setQuizzesLoading(false);
                }
            }
        };

        if (activeTab === 'quizzes') {
            loadQuizzes();
        }
    }, [selectedCourse, activeTab]);

    return (
            <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onQuizzesClick={() => selectedCourse && setShowQuizForm(true)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
            </div>
          )}

          {/* Pestaña: Mis Cursos */}
          {activeTab === 'my-courses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Mis Cursos</h2>
                <button
                  onClick={() => setShowCourseForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  + Nuevo Curso
                </button>
              </div>

              {showCourseForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h3 className="text-lg font-bold mb-4">Nuevo Curso</h3>
                  <form onSubmit={handleCreateCourse}>
                    <input
                      type="text"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      placeholder="Nombre del curso"
                      className="w-full p-2 border rounded mb-4"
                      required
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowCourseForm(false)}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                      >
                        Crear Curso
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {courses.length === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p>No tienes cursos creados aún.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {courses.map(course => (
                    <div
                      key={course.id}
                      className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                      onClick={() => {
                        setSelectedCourse(course);
                        setActiveTab('quizzes');
                      }}
                    >
                      <h3 className="font-bold text-lg">{course.title}</h3>
                      <p className="text-gray-600">Haz click para gestionar evaluaciones</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pestaña: Evaluaciones */}
          {activeTab === 'quizzes' && selectedCourse && (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">
        Evaluaciones para: {selectedCourse.title}
      </h2>
      <button
        onClick={() => setShowQuizForm(!showQuizForm)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {showQuizForm ? 'Cancelar' : '+ Nueva Evaluación'}
      </button>
    </div>

    {showQuizForm ? (
      <QuizForm
        courseId={selectedCourse.id}
        onSuccess={() => {
          setShowQuizForm(false);
          // Recargar quizzes
          const loadQuizzes = async () => {
            const data = await getQuizzesByCourse(selectedCourse.id);
            setQuizzes(data);
          };
          loadQuizzes();
        }}
      />
    ) : (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Tus evaluaciones</h3>
        
        {quizzesLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-500">No hay evaluaciones para este curso</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">{quiz.title}</h4>
                    <p className="text-gray-600">
                      {quiz.questions.length} preguntas • {quiz.passing_score}% para aprobar
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {quiz.gamification?.points_per_question * quiz.questions.length} pts
                      </span>
                      {quiz.gamification?.badge_name && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {quiz.gamification.badge_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
)}