import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { fetchStudentCourses } from "../../../api/courses";
import { getStudentQuizzes } from "../../../api/quizzes";
import Sidebar from "../../../components/student/Sidebar";
import Header from "../../../components/student/Header";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import GamificationBadge from "../../../components/gamification/GamificationBadge";

export default function StudentDashboard() {
  const { user, isAuthenticated, loading: authLoading, verifyAuth } = useAuth();
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState("courses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!authLoading) {
        if (!isAuthenticated) {
          navigate("/login");
          return;
        }

        if (user?.role !== "student") {
          navigate("/dashboard");
          return;
        }

        try {
          setLoading(true);
          const [coursesData, quizzesData] = await Promise.all([
            fetchStudentCourses(),
            getStudentQuizzes(),
          ]);
          setCourses(coursesData);
          setQuizzes(quizzesData);
          setError(null);
        } catch (err) {
          console.error("Error loading data:", err);
          if (err.response?.status === 401) {
            await verifyAuth();
          }
          setError(err.message || "Error al cargar los datos");

          // Mensaje más específico para 404
          if (err.response?.status === 404) {
            setError(
              "No se pudo conectar con el servidor. Verifica la configuración"
            );
          }
        } finally {
          setLoading(false);
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
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />

        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          {error && (
            <div className="max-w-7xl mx-auto mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{error}</p>
                  <p className="text-sm mt-1">Por favor intenta nuevamente</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {activeTab === "courses"
                      ? "Mis Cursos"
                      : "Mis Evaluaciones"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {activeTab === "courses"
                      ? "Explora tus cursos asignados"
                      : "Revisa tus evaluaciones pendientes y completadas"}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <GamificationBadge user={user} />
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Actualizar
                  </button>
                </div>
              </div>

              {/* Content Section */}
              {activeTab === "courses" ? (
                courses.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-700 mt-4">
                      No tienes cursos asignados
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Cuando te asignen cursos, aparecerán aquí
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-indigo-200 group relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors">
                              {course.title}
                            </h3>
                            <p className="text-gray-500 mt-2 text-sm">
                              Profesor: {course.teacher_name}
                            </p>
                          </div>
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-indigo-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-500">
                              Evaluaciones:
                            </span>
                            <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-medium">
                              {course.quiz_count}{" "}
                              {course.quiz_count === 1
                                ? "evaluación"
                                : "evaluaciones"}
                            </span>
                          </div>
                          <button
                            onClick={() => navigate(`/course/${course.id}`)}
                            className="mt-4 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Ver curso
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : quizzes.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mt-4">
                    No tienes evaluaciones pendientes
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Cuando te asignen evaluaciones, aparecerán aquí
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all relative overflow-hidden"
                    >
                      {quiz.completed ? (
                        <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-bl-lg">
                          Completado
                        </div>
                      ) : (
                        <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-bl-lg">
                          Pendiente
                        </div>
                      )}

                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {quiz.title}
                          </h3>
                          <p className="text-gray-500 mt-1 text-sm">
                            Curso: {quiz.course_title}
                          </p>
                          <div className="flex items-center space-x-3 mt-3">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">
                              {quiz.questions_count}{" "}
                              {quiz.questions_count === 1
                                ? "pregunta"
                                : "preguntas"}
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium">
                              {quiz.passing_score}% para aprobar
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/quiz/${quiz.id}`)}
                          className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${
                            quiz.completed
                              ? "bg-indigo-500 hover:bg-indigo-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {quiz.completed ? "Ver resultados" : "Realizar quiz"}
                        </button>
                      </div>
                      {quiz.completed && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                quiz.passed
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {quiz.passed ? "Aprobado" : "No aprobado"}
                            </span>
                            <span className="text-gray-600 text-sm">
                              Puntuación: {quiz.score}%
                            </span>
                            {quiz.xp_earned && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full font-medium">
                                +{quiz.xp_earned} XP
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
