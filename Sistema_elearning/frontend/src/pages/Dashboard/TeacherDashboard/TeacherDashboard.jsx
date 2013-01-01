import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  fetchTeacherCourses, 
  createCourse,
  fetchPeriods,
  getCourseDetails
} from '../../../api/courses';
import { getQuizzesByCourse } from '../../../api/quizzes';
import Sidebar from '../../../components/teacher/Sidebar';
import Header from '../../../components/teacher/Header';
import CourseCreationWizard from './components/CourseCreationWizard';
import CourseDetailView from './CourseDetailView/CourseDetailView';
import QuizForm from './CourseDetailView/QuizForm';
import {
  PlusIcon,
  XMarkIcon,
  UserGroupIcon,
  ArrowLeftIcon
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
  const [showCourseWizard, setShowCourseWizard] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [courseDetails, setCourseDetails] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [coursesData, periodsData] = await Promise.all([
          fetchTeacherCourses(),
          fetchPeriods()
        ]);
        setCourses(coursesData);
        setPeriods(periodsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'teacher') loadInitialData();
  }, [user]);

  // Cargar detalles del curso cuando se selecciona
  const loadCourseDetails = async (courseId) => {
    try {
      const details = await getCourseDetails(courseId);
      setCourseDetails(details);
      setViewMode('detail');
    } catch (err) {
      setError(err.message);
    }
  };

  // Cambiar pestaña
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== 'quizzes') {
      setShowQuizForm(false);
      setSelectedCourse(null);
    }
    setViewMode('list');
  };

  // Cargar quizzes cuando se selecciona un curso
  useEffect(() => {
    const loadQuizzes = async () => {
      if (selectedCourse && activeTab === 'quizzes') {
        try {
          const data = await getQuizzesByCourse(selectedCourse.id);
          setQuizzes(data);
        } catch (err) {
          setError(err.message);
        }
      }
    };

    loadQuizzes();
  }, [selectedCourse, activeTab]);

  // Manejar creación de curso exitosa
  const handleCourseCreated = (newCourse) => {
    setCourses([...courses, newCourse]);
    setShowCourseWizard(false);
    setSelectedCourse(newCourse);
    loadCourseDetails(newCourse.id);
  };

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

          {viewMode === 'detail' && courseDetails && (
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => setViewMode('list')}
                className="flex items-center text-indigo-600 mb-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Volver a la lista
              </button>
              <CourseDetailView 
                course={courseDetails} 
                onQuizCreated={() => loadCourseDetails(courseDetails.id)}
              />
            </div>
          )}

          {viewMode === 'list' && activeTab === 'my-courses' && (
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Mis Cursos</h2>
                  <p className="text-gray-600 mt-1">Gestiona tus cursos académicos</p>
                </div>
                <button
                  onClick={() => setShowCourseWizard(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Nuevo Curso
                </button>
              </div>

              {showCourseWizard && (
                <CourseCreationWizard
                  periods={periods}
                  teacherId={user.id}
                  onSuccess={handleCourseCreated}
                  onCancel={() => setShowCourseWizard(false)}
                />
              )}

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
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => loadCourseDetails(course.id)}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                          {course.period}-{course.year}
                        </span>
                      </div>
                      <p className="text-gray-500 mt-2 text-sm">{course.description || 'Sin descripción'}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {course.student_count || 0} estudiantes
                        </span>
                        <button 
                          className="text-indigo-600 text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCourse(course);
                            setActiveTab('quizzes');
                          }}
                        >
                          Ver evaluaciones
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === 'list' && activeTab === 'quizzes' && selectedCourse && (
            <div className="max-w-7xl mx-auto">
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
                        <div key={quiz.id} className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-lg">{quiz.title}</h4>
                              <p className="text-gray-500 text-sm mt-1">{quiz.description}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded ${
                              quiz.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {quiz.is_published ? 'Publicado' : 'Borrador'}
                            </span>
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {quiz.question_count} preguntas
                            </span>
                            <button 
                              className="text-indigo-600 text-sm font-medium"
                              onClick={() => {
                                // Implementar vista detalle del quiz
                              }}
                            >
                              Ver resultados
                            </button>
                          </div>
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