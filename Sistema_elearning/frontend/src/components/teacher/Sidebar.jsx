export default function Sidebar({ activeTab, onTabChange, onQuizzesClick }) {
  const tabs = [
    { 
      id: 'my-courses', 
      label: 'Mis Cursos', 
      icon: ''
    },
    { 
      id: 'quizzes', 
      label: 'Evaluaciones', 
      icon: '',
      onClick: onQuizzesClick
    },
    { 
      id: 'students', 
      label: 'Estudiantes', 
      icon: '' 
    },
    { 
      id: 'analytics', 
      label: 'Analíticas', 
      icon: '' 
    }
  ];

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <div className="flex items-center mb-8 p-2">
        <h1 className="text-xl font-bold">Panel del Profesor</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {tabs.map(tab => (
            <li key={tab.id}>
              <button
                onClick={() => {
                  onTabChange(tab.id);
                  if (tab.onClick) tab.onClick();
                }}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}