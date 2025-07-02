import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getQuizDetails, submitQuizAnswers } from '../../../api/quizzes';
import LoadingSpinner from '../../../components/common/LoadingSpinner';


export default function StudentQuiz() {
    const { quizId } = useParams();
    const { user, updateUserXP } = useAuth();
    const navigate = useNavigate();
    
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState(null);

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                setLoading(true);
                const data = await getQuizDetails(quizId);
                setQuiz(data);
                
                // Inicializar respuestas vacías
                const initialAnswers = {};
                data.questions.forEach((q, index) => {
                    initialAnswers[index] = '';
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

    const handleAnswerChange = (questionIndex, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Preparar respuestas para enviar
            const formattedAnswers = quiz.questions.map((q, index) => ({
                question_id: q.id,
                answer: answers[index] || ''
            }));

            const submissionResult = await submitQuizAnswers(quizId, formattedAnswers);
            setResults(submissionResult);

            // Actualizar XP del estudiante
            if (submissionResult.xp_earned) {
                await updateUserXP(submissionResult.xp_earned);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                    <p className="font-medium text-red-700">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {results ? (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Resultados del Quiz</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <p className="text-sm text-blue-600 font-medium">Puntuación</p>
                            <p className="text-3xl font-bold text-blue-800">
                                {results.score}%
                            </p>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <p className="text-sm text-green-600 font-medium">Respuestas correctas</p>
                            <p className="text-3xl font-bold text-green-800">
                                {results.correct_answers} / {quiz.questions.length}
                            </p>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <p className="text-sm text-purple-600 font-medium">XP Ganada</p>
                            <p className="text-3xl font-bold text-purple-800">
                                {results.xp_earned || 0}
                            </p>
                        </div>
                    </div>
                    
                    {results.passed ? (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
                            <p className="font-medium text-green-700">¡Felicidades! Has aprobado este quiz.</p>
                            {results.badge_earned && (
                                <p className="mt-2 text-green-600">
                                    Has ganado la insignia: <span className="font-bold">{results.badge_earned}</span>
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-lg">
                            <p className="font-medium text-yellow-700">
                                No has alcanzado el puntaje mínimo para aprobar ({quiz.passing_score}% requerido).
                            </p>
                        </div>
                    )}
                    
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Detalle de respuestas</h3>
                        <div className="space-y-4">
                            {quiz.questions.map((question, qIndex) => {
                                const userAnswer = answers[qIndex];
                                const isCorrect = results.question_results[qIndex].is_correct;
                                
                                return (
                                    <div 
                                        key={qIndex} 
                                        className={`p-4 rounded-lg border ${
                                            isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                                        }`}
                                    >
                                        <p className="font-medium text-gray-800">
                                            {qIndex + 1}. {question.text}
                                        </p>
                                        
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Tu respuesta:</span> {userAnswer || '(Sin responder)'}
                                            </p>
                                            {!isCorrect && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    <span className="font-medium">Respuesta correcta:</span> {question.correct_answer}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                        >
                            Volver al Dashboard
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">{quiz.title}</h2>
                        <p className="text-gray-600">{quiz.description}</p>
                        <div className="mt-4 flex items-center space-x-4">
                            <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-medium">
                                {quiz.questions.length} {quiz.questions.length === 1 ? 'pregunta' : 'preguntas'}
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium">
                                {quiz.passing_score}% para aprobar
                            </span>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {quiz.questions.map((question, qIndex) => (
                            <div key={qIndex} className="border border-gray-200 p-4 rounded-lg">
                                <p className="font-medium text-gray-800 mb-3">
                                    {qIndex + 1}. {question.text}
                                </p>
                                
                                <div className="space-y-2">
                                    {question.options.map((option, oIndex) => (
                                        <div key={oIndex} className="flex items-center">
                                            <input
                                                type="radio"
                                                id={`q${qIndex}-o${oIndex}`}
                                                name={`question-${qIndex}`}
                                                value={option}
                                                checked={answers[qIndex] === option}
                                                onChange={() => handleAnswerChange(qIndex, option)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label 
                                                htmlFor={`q${qIndex}-o${oIndex}`}
                                                className="ml-3 block text-gray-700"
                                            >
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-3 rounded-lg font-medium text-white ${
                                isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Quiz'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}