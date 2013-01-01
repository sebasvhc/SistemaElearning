import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createQuiz } from '../../api/quizzes';

export default function QuizForm({ courseId, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = () => {
    if (newQuestion.trim() && newOptions.every(opt => opt.trim())) {
      setQuestions([...questions, {
        text: newQuestion,
        options: newOptions,
        correct_answer: newOptions[correctAnswerIndex]
      }]);
      setNewQuestion('');
      setNewOptions(['', '']);
      setCorrectAnswerIndex(0);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = value;
    setNewOptions(updatedOptions);
  };

  const addOption = () => {
    setNewOptions([...newOptions, '']);
  };

  const removeOption = (index) => {
    const updatedOptions = newOptions.filter((_, i) => i !== index);
    setNewOptions(updatedOptions);
    if (correctAnswerIndex >= index) {
      setCorrectAnswerIndex(Math.max(0, correctAnswerIndex - 1));
    }
  };

  const onSubmit = async (data) => {
    if (questions.length === 0) {
      alert('Debes agregar al menos una pregunta');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const quizData = {
        title: data.title,
        course: courseId,
        questions,
        passing_score: data.passingScore || 70,
        gamification: {
          points_per_question: data.pointsPerQuestion || 10,
          badge_name: data.badgeName || 'Quiz Completer',
          xp_reward: data.xpReward || 100
        }
      };

      await createQuiz(quizData);
      onSuccess();
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error al crear el quiz. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold mb-4">Crear nuevo Quiz</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Título del Quiz</label>
          <input
            {...register('title', { required: 'Este campo es requerido' })}
            className="w-full p-2 border rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div className="border p-4 rounded-lg">
          <h4 className="font-medium mb-2">Agregar Nueva Pregunta</h4>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">Pregunta</label>
            <input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Escribe la pregunta"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1">Opciones de respuesta</label>
            {newOptions.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctAnswerIndex === index}
                  onChange={() => setCorrectAnswerIndex(index)}
                  className="mr-2"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder={`Opción ${index + 1}`}
                />
                {newOptions.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addOption}
              className="text-sm text-blue-600 mt-1"
            >
              + Agregar otra opción
            </button>
          </div>

          <button
            type="button"
            onClick={addQuestion}
            className="bg-gray-200 px-4 py-1 rounded text-sm"
            disabled={!newQuestion.trim() || newOptions.some(opt => !opt.trim())}
          >
            Agregar Pregunta
          </button>
        </div>

        {questions.length > 0 && (
          <div className="border p-4 rounded-lg">
            <h4 className="font-medium mb-2">Preguntas ({questions.length})</h4>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {questions.map((q, i) => (
                <li key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{q.text}</span>
                  <button
                    type="button"
                    onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Puntaje para aprobar (%)</label>
            <input
              type="number"
              {...register('passingScore', { min: 0, max: 100 })}
              defaultValue={70}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Puntos por pregunta</label>
            <input
              type="number"
              {...register('pointsPerQuestion', { min: 1 })}
              defaultValue={10}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Insignia</label>
            <input
              {...register('badgeName')}
              placeholder="Nombre de la insignia"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={() => onSuccess()}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || questions.length === 0}
            className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}