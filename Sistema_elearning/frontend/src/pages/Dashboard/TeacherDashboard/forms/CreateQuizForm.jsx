import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CreateQuizForm({ courseId, onSuccess }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");

    const addQuestion = () => {
        if (newQuestion.trim()) {
            setQuestions([...questions, {
                text: newQuestion,
                options: ["Verdadero", "Falso"],
                correct_answer: "Verdadero"
            }]);
            setNewQuestion("");
        }
    };

    const onSubmit = async (data) => {
        if (questions.length === 0) {
            alert("Añade al menos una pregunta");
            return;
        }
        
        try {
            await createQuiz({
                course: courseId,
                title: data.title,
                questions,
                gamification: {
                    points_per_question: data.points || 10,
                    badge_name: data.badge || "Quiz Master"
                }
            });
            onSuccess();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campos del formulario */}
            <div className="border p-4">
                <h3 className="font-bold">Preguntas ({questions.length})</h3>
                <div className="flex mt-2">
                    <input
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="flex-1 p-2 border"
                        placeholder="Nueva pregunta"
                    />
                    <button 
                        type="button" 
                        onClick={addQuestion}
                        className="ml-2 bg-gray-200 px-4"
                    >
                        +
                    </button>
                </div>
                <ul className="mt-2">
                    {questions.map((q, i) => (
                        <li key={i} className="py-1">• {q.text}</li>
                    ))}
                </ul>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Crear Evaluación
            </button>
        </form>
    );
}