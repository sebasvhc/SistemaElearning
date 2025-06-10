// components/student/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { 
  BookOpenIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    {
      name: 'Mis Cursos',
      tab: 'my-courses',
      path: '/student/my-courses',
      icon: <BookOpenIcon className="w-5 h-5" />
    },
    {
      name: 'Explorar Cursos',
      tab: 'all-courses',
      path: '/student/courses',
      icon: <MagnifyingGlassIcon className="w-5 h-5" />
    },
    {
      name: 'Mi Progreso',
      tab: 'progress',
      path: '/student/progress',
      icon: <ChartBarIcon className="w-5 h-5" />
    },
  ];

  return (
    <div className="w-64 h-full bg-gradient-to-b from-blue-50 to-indigo-50 border-r border-gray-200 flex flex-col">
      {/* Encabezado */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-800">Aula Virtual</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">Panel del Estudiante</p>
      </div>

      {/* Menú */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.tab}
            to={item.path}
            onClick={() => setActiveTab(item.tab)}
            className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-lg transition-all
              ${isActive ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-white hover:bg-opacity-50'}
            `}
          >
            <span className={`mr-3 ${activeTab === item.tab ? 'text-indigo-500' : 'text-gray-400'}`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.name}</span>
            {activeTab === item.tab && (
              <span className="ml-auto w-2 h-2 bg-indigo-500 rounded-full"></span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Pie */}
      <div className="p-4 border-t border-gray-200">
        <button
          className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-red-500 transition-colors"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {/* Efecto decorativo */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
    </div>
  );
}