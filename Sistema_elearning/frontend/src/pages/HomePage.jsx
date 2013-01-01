// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null; // O muestra un spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">EduLearn</h1>
            </div>
            <div className="flex space-x-4">
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Mi Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-md text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Aprende Inglés <span className="text-indigo-600">Interactivo</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Domina el inglés con nuestro sistema adaptativo y clases
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            to={isAuthenticated ? "/courses" : "/register"} 
            className="px-8 py-3 text-lg font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Comenzar Ahora
          </Link>
          <Link 
            to="/features" 
            className="px-8 py-3 text-lg font-medium rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
          >
            Ver Cursos
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">...</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="📚" 
            title="Cursos Interactivos" 
            description="Ejercicios prácticos con retroalimentación inmediata"
          />
          {/* 
          <FeatureCard 
            icon="🎧" 
            title="Audio Nativo" 
            description="Grabaciones con hablantes nativos de inglés"
          />
          */}
          <FeatureCard 
            icon="📈" 
            title="Seguimiento de Progreso" 
            description="Monitoriza tu avance con métricas detalladas"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} EduLearn. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Componente de tarjeta de características (reutilizable)
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}