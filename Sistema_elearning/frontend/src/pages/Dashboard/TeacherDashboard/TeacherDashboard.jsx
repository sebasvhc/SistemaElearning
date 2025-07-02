import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { fetchTeacherCourses, createCourse } from '../../../api/courses';
import { getQuizzesByCourse } from '../../../api/quizzes';
import Sidebar from '../../../components/teacher/Sidebar';
import Header from '../../../components/teacher/Header';
import QuizForm from './QuizForm';
import {
  PlusIcon,
  XMarkIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

const TeacherDashboard = () => {
  // Estados
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

  // Cargar cursos
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchTeacherCourses();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'teacher') loadCourses();
  }, [user]);

  // Crear nuevo curso
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const newCourse = await createCourse({
        title: courseTitle,
        teacher_id: user.id
      });
      setCourses([...courses, newCourse]);
      setCourseTitle('');
      setShowCourseForm(false);
    } catch (error) {
      setError(error.response?.data?.detail || 'Error al crear el curso');
    }
  };

  // Cambiar pestaña
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== 'quizzes') setShowQuizForm(false);
  };

  // Cargar quizzes cuando se selecciona un curso
  useEffect(() => {
    const loadQuizzes = async () => {
      if (selectedCourse) {
        try {
          const data = await getQuizzesByCourse(selectedCourse.id);
          setQuizzes(data);
        } catch (err) {
          setError(err.message);
        }
      }
    };

    if (activeTab === 'quizzes') loadQuizzes();
  }, [selectedCourse, activeTab]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onQuizzesClick={() => selectedCourse && setShowQuizForm(true)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />

        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg">
              <p>{error}</p>
            </div>
          )}

          {activeTab === 'my-courses' && (
            <div className="max-w-7xl mx-auto">
              {/* Sección de Cursos */}
              <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Mis Cursos</h2>
                  <p className="text-gray-600 mt-1">Gestiona tus cursos académicos</p>
                </div>
                <button
                  onClick={() => setShowCourseForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Nuevo Curso
                </button>
              </div>

              {/* Formulario de Curso */}
              {showCourseForm && (
                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                  <form onSubmit={handleCreateCourse}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del curso
                      </label>
                      <input
                        type="text"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowCourseForm(false)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg"
                      >
                        Crear Curso
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Lista de Cursos */}
              {courses.length === 0 ? (
                <div className="bg-white p-8 rounded-xl text-center">
                  <UserGroupIcon className="h-16 w-16 mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-4">No tienes cursos creados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                      onClick={() => {
                        setSelectedCourse(course);
                        setActiveTab('quizzes');
                      }}
                    >
                      <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                      <p className="text-gray-500 mt-2 text-sm">Código: {course.code || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'quizzes' && selectedCourse && (
            <div className="max-w-7xl mx-auto">
              {/* Sección de Quizzes */}
              <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Evaluaciones: <span className="text-indigo-600">{selectedCourse.title}</span>
                  </h2>
                  <p className="text-gray-600 mt-1">Gestiona evaluaciones para tus estudiantes</p>
                </div>
                <button
                  onClick={() => setShowQuizForm(!showQuizForm)}
                  className={`px-5 py-2.5 rounded-lg flex items-center gap-2 ${
                    showQuizForm ? 'bg-gray-200 text-gray-700' : 'bg-indigo-600 text-white'
                  }`}
                >
                  {showQuizForm ? (
                    <>
                      <XMarkIcon className="h-5 w-5" />
                      Cancelar
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-5 w-5" />
                      Nueva Evaluación
                    </>
                  )}
                </button>
              </div>

              {showQuizForm ? (
                <QuizForm
                  courseId={selectedCourse.id}
                  onSuccess={() => {
                    setShowQuizForm(false);
                    getQuizzesByCourse(selectedCourse.id).then(setQuizzes);
                  }}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-6">Tus evaluaciones</h3>
                  {quizzes.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No hay evaluaciones para este curso</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {quizzes.map((quiz) => (
                        <div key={quiz.id} className="border border-gray-200 rounded-lg p-5">
                          <h4 className="font-bold text-lg">{quiz.title}</h4>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;