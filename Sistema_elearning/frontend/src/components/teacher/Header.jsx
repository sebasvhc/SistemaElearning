import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function Header({ user }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">Panel del Profesor</h1>
            <p className="text-xs text-gray-500">Gestión académica</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-gray-500">Profesor</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-sm">
            {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}