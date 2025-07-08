import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PlusIcon, TrashIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function QuizForm({ quizzes, updateQuizzes, courseId, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionType, setQuestionType] = useState('multiple'); // 'multiple' o 'boolean'

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    
    const questionData = {
      text: newQuestion,
      question_type: questionType,
      options: questionType === 'boolean' ? ['Verdadero', 'Falso'] : newOptions.filter(opt => opt.trim()),
      correct_answer: questionType === 'boolean' ? 'Verdadero' : newOptions[correctAnswerIndex]
    };

    setQuestions([...questions, questionData]);
    resetQuestionForm();
  };

  const resetQuestionForm = () => {
    setNewQuestion('');
    setNewOptions(['', '']);
    setCorrectAnswerIndex(0);
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

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
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
        description: data.description || '',
        questions,
        passing_score: data.passingScore || 70,
        is_published: false,
        gamification: {
          points_per_question: data.pointsPerQuestion || 10,
          badge_name: data.badgeName || 'Quiz Completer',
          xp_reward: data.xpReward || 100
        }
      };

      // Actualiza la lista de quizzes en el wizard
      updateQuizzes([...quizzes, quizData]);
      
      // Cierra el formulario si es parte del wizard
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error al crear el quiz. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold mb-4">Crear nueva evaluación</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Título de la evaluación *</label>
            <input
              {...register('title', { required: 'Este campo es requerido' })}
              className="w-full p-2 border rounded"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>
          
          <div>
            <label className="block font-medium mb-1">Tipo de pregunta</label>
            <select
              value={questionType}
              onChange={(e) => {
                setQuestionType(e.target.value);
                if (e.target.value === 'boolean') {
                  setNewOptions(['Verdadero', 'Falso']);
                  setCorrectAnswerIndex(0);
                }
              }}
              className="w-full p-2 border rounded"
            >
              <option value="multiple">Opción múltiple</option>
              <option value="boolean">Verdadero/Falso</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Descripción</label>
          <textarea
            {...register('description')}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>

        <div className="border p-4 rounded-lg">
          <h4 className="font-medium mb-2">Agregar nueva pregunta</h4>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">Pregunta *</label>
            <input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Escribe la pregunta"
            />
          </div>

          {questionType === 'multiple' && (
            <div className="mb-3">
              <label className="block text-sm mb-1">Opciones de respuesta *</label>
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
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addOption}
                className="text-sm text-blue-600 hover:text-blue-800 mt-1 flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Agregar otra opción
              </button>
            </div>
          )}

          {questionType === 'boolean' && (
            <div className="mb-3">
              <label className="block text-sm mb-1">Respuesta correcta</label>
              <div className="flex space-x-4">
                {['Verdadero', 'Falso'].map((option, index) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="correctBoolean"
                      checked={correctAnswerIndex === index}
                      onChange={() => setCorrectAnswerIndex(index)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={addQuestion}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded flex items-center"
            disabled={
              !newQuestion.trim() || 
              (questionType === 'multiple' && newOptions.some(opt => !opt.trim()))
            }
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Agregar Pregunta
          </button>
        </div>

        {questions.length > 0 && (
          <div className="border p-4 rounded-lg">
            <h4 className="font-medium mb-2">
              Preguntas agregadas ({questions.length})
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Haz clic en × para eliminar)
              </span>
            </h4>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {questions.map((q, i) => (
                <li key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100">
                  <div>
                    <p className="font-medium">{q.text}</p>
                    <p className="text-sm text-gray-600">
                      {q.question_type === 'boolean' ? 'Verdadero/Falso' : `${q.options.length} opciones`} • 
                      Correcta: {q.correct_answer}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Puntaje mínimo para aprobar (%) *</label>
            <input
              type="number"
              {...register('passingScore', { 
                required: 'Este campo es requerido',
                min: { value: 1, message: 'Mínimo 1%' },
                max: { value: 100, message: 'Máximo 100%' }
              })}
              defaultValue={70}
              className="w-full p-2 border rounded"
            />
            {errors.passingScore && (
              <p className="text-red-500 text-sm">{errors.passingScore.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm mb-1">Puntos por pregunta *</label>
            <input
              type="number"
              {...register('pointsPerQuestion', { 
                required: 'Este campo es requerido',
                min: { value: 1, message: 'Mínimo 1 punto' }
              })}
              defaultValue={10}
              className="w-full p-2 border rounded"
            />
            {errors.pointsPerQuestion && (
              <p className="text-red-500 text-sm">{errors.pointsPerQuestion.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm mb-1">Insignia al completar</label>
            <input
              {...register('badgeName')}
              placeholder="Ej: Experto en Matemáticas"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center"
          >
            <XMarkIcon className="h-5 w-5 mr-1" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || questions.length === 0}
            className={`px-4 py-2 rounded-lg text-white flex items-center ${
              isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <CheckIcon className="h-5 w-5 mr-1" />
                Guardar Evaluación
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}