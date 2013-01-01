import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, submitQuizAnswers } from '../../api/quizzes';
import { useAuth } from '../../context/AuthContext';

export default function StudentQuiz() {
  const { quizId } = useParams();
  const { user, updateUserXP } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const data = await getQuizById(quizId);
        setQuiz(data);
        
        // Inicializar respuestas vacías
        const initialAnswers = {};
        data.questions.forEach((q, i) => {
          initialAnswers[i] = '';
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionIndex, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const handleSubmit = async () => {
    const unanswered = Object.values(answers).some(a => !a);
    if (unanswered) {
      alert('Por favor responde todas las preguntas');
      return;
    }

    setSubmitting(true);
    try {
      const submission = quiz.questions.map((q, i) => ({
        question_id: q.id,
        answer: answers[i]
      }));

      const response = await submitQuizAnswers(quizId, submission);
      setResult(response);
      
      // Actualizar XP del usuario
      if (response.xp_earned) {
        await updateUserXP(response.xp_earned);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando quiz...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Resultados del Quiz</h2>
        <div className={`p-4 rounded-lg mb-6 ${result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-bold">{result.passed ? '¡Felicidades! Aprobaste' : 'No aprobaste esta vez'}</p>
          <p>Puntaje: {result.score}% (Se necesitaba {quiz.passing_score}%)</p>
          {result.xp_earned && <p>Ganaste {result.xp_earned} XP</p>}
          {result.new_badge && <p className="font-medium">¡Nueva insignia desbloqueada: {result.new_badge}!</p>}
        </div>
        
        <div className="space-y-6">
          {quiz.questions.map((q, qIndex) => {
            const userAnswer = answers[qIndex];
            const isCorrect = userAnswer === q.correct_answer;
            
            return (
              <div key={qIndex} className="border rounded-lg p-4">
                <p className="font-medium mb-2">{q.text}</p>
                <div className="space-y-2">
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className={`p-2 border rounded ${option === q.correct_answer ? 'bg-green-50 border-green-200' : option === userAnswer && !isCorrect ? 'bg-red-50 border-red-200' : ''}`}>
                      {option}
                      {option === q.correct_answer && <span className="ml-2 text-green-600">✓ Respuesta correcta</span>}
                      {option === userAnswer && !isCorrect && <span className="ml-2 text-red-600">✗ Tu respuesta</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <button
          onClick={() => navigate(`/course/${quiz.course.id}`)}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Volver al curso
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
      <p className="text-gray-600 mb-6">Curso: {quiz.course.title}</p>
      
      <div className="mb-6 p-3 bg-blue-50 rounded-lg">
        <p className="font-medium">Instrucciones:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Responde todas las preguntas</li>
          <li>Necesitas al menos {quiz.passing_score}% para aprobar</li>
          <li>Puedes ganar hasta {quiz.gamification.points_per_question * quiz.questions.length} puntos</li>
          {quiz.gamification.badge_name && <li>Insignia: {quiz.gamification.badge_name}</li>}
        </ul>
      </div>
      
      <div className="space-y-8">
        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="border-b pb-6">
            <p className="font-medium mb-3">{qIndex + 1}. {q.text}</p>
            <div className="space-y-2">
              {q.options.map((option, oIndex) => (
                <label key={oIndex} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    checked={answers[qIndex] === option}
                    onChange={() => handleAnswerChange(qIndex, option)}
                    className="h-4 w-4"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`mt-6 w-full py-3 rounded text-white font-medium ${submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {submitting ? 'Enviando...' : 'Enviar Respuestas'}
      </button>
    </div>
  );
}