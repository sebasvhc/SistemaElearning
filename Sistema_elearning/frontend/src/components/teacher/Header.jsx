// components/teacher/Header.jsx
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-medium ">Bienvenido, {user.first_name}</h2>
        <button 
          onClick={logout}
          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}