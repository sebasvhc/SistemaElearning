import React, { useState } from 'react';
import { PencilSquareIcon, CalendarIcon, UserGroupIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const CourseInfoTab = ({ course, updateCourse }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState({...course});

  // Opciones para los periodos académicos
  const periodOptions = [
    { value: 'I', label: 'Periodo I' },
    { value: 'II', label: 'Periodo II' },
    { value: 'ANUAL', label: 'Anualizado' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse(prev => ({...prev, [name]: value}));
  };

  const handlePeriodChange = (e) => {
    setEditedCourse(prev => ({...prev, period: e.target.value}));
  };

  const handleYearChange = (e) => {
    setEditedCourse(prev => ({...prev, year: e.target.value}));
  };

  const handleSave = () => {
    updateCourse(editedCourse);
    setIsEditing(false);
  };

  const getPeriodDisplay = () => {
    const periodObj = periodOptions.find(p => p.value === course.period);
    return `${periodObj?.label || course.period} - ${course.year}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Información del Curso</h2>
        {isEditing ? (
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setEditedCourse({...course});
                setIsEditing(false);
              }}
              className="flex items-center px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              <CheckIcon className="h-4 w-4 mr-1" />
              Guardar
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <PencilSquareIcon className="h-5 w-5 mr-1" />
            Editar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Título del Curso</label>
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editedCourse.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <p className="text-lg font-medium">{course.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Descripción</label>
            {isEditing ? (
              <textarea
                name="description"
                value={editedCourse.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-line">
                {course.description || 'Sin descripción'}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Período Académico</p>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={editedCourse.period}
                    onChange={handlePeriodChange}
                    className="p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {periodOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={editedCourse.year}
                    onChange={handleYearChange}
                    min="2000"
                    max="2100"
                    className="p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              ) : (
                <p className="font-medium">{getPeriodDisplay()}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <UserGroupIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Estudiantes Inscritos</p>
              <p className="font-medium">{course.students?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInfoTab;