import { useState, useEffect } from 'react';
import { fetchQuizResults } from "../../../../../api/quizzes";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ResultsTab = ({ courseId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await fetchQuizResults(courseId);
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay resultados disponibles para mostrar
      </div>
    );
  }

  // Preparar datos para el gráfico
  const chartData = results.map(quiz => ({
    name: quiz.quiz_title,
    promedio: quiz.average_score,
    aprobados: quiz.passed_count,
    reprobados: quiz.failed_count
  }));

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Resultados de Evaluaciones</h3>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h4 className="font-medium mb-4">Resumen Estadístico</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="promedio" fill="#8884d8" name="Puntaje Promedio" />
            <Bar dataKey="aprobados" fill="#82ca9d" name="Estudiantes Aprobados" />
            <Bar dataKey="reprobados" fill="#ffc658" name="Estudiantes Reprobados" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-6">
        {results.map((quizResult) => (
          <div key={quizResult.quiz_id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg">{quizResult.quiz_title}</h4>
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                  Promedio: {quizResult.average_score.toFixed(1)}%
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                  Aprobados: {quizResult.passed_count}
                </span>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  Reprobados: {quizResult.failed_count}
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Puntaje
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quizResult.submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {submission.student_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.score.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          submission.is_passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {submission.is_passed ? 'Aprobado' : 'Reprobado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsTab;