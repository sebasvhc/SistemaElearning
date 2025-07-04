import React, { useState } from 'react';
import { PencilSquareIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const CourseInfoTab = ({ course, updateCourse }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState({...course});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse(prev => ({...prev, [name]: value}));
  };

  const handleSave = () => {
    updateCourse(editedCourse);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Información del Curso</h2>
        {isEditing ? (
          <div className="space-x-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded"
            >
              Guardar
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center text-indigo-600"
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
                className="w-full p-2 border border-gray-300 rounded"
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
                className="w-full p-2 border border-gray-300 rounded"
              />
            ) : (
              <p className="text-gray-700">{course.description || 'Sin descripción'}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Período Académico</p>
              <p className="font-medium">{course.period}-{course.year}</p>
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