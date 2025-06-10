import React from 'react';

export default function Header({ user }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900">Panel del Estudiante</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {user?.first_name || 'Estudiante'}
          </span>
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {user?.first_name?.charAt(0) || 'E'}
          </div>
        </div>
      </div>
    </header>
  );
}