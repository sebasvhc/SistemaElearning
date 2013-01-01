import { useState } from 'react';
import QuizForm from './QuizForm';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const EvaluationsTab = ({ quizzes, courseId, onQuizCreated }) => {
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleQuizCreated = () => {
    setShowQuizForm(false);
    setSelectedQuiz(null);
    if (onQuizCreated) onQuizCreated();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Evaluaciones del curso</h3>
        <button
          onClick={() => {
            setSelectedQuiz(null);
            setShowQuizForm(!showQuizForm);
          }}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
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
          courseId={courseId}
          quiz={selectedQuiz}
          onSuccess={handleQuizCreated}
          onCancel={() => setShowQuizForm(false)}
        />
      ) : (
        <div className="space-y-4">
          {quizzes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay evaluaciones para este curso
            </div>
          ) : (
            quizzes.map((quiz) => (
              <div 
                key={quiz.id} 
                className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedQuiz(quiz);
                  setShowQuizForm(true);
                }}
              >
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
                    {quiz.question_count} preguntas • Puntaje mínimo: {quiz.passing_score}%
                  </span>
                  <span className="text-sm font-medium text-indigo-600">
                    Ver detalles
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EvaluationsTab;