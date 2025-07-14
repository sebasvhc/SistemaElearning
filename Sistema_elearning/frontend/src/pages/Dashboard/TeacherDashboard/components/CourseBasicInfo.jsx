import React from 'react';

const CourseBasicInfo = ({ courseData, updateCourseData, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateCourseData(name, value);
  };

  // Opciones de período que coinciden exactamente con PERIOD_CHOICES del modelo
  const periodOptions = [
    { value: 'I', label: 'Periodo I' },
    { value: 'II', label: 'Periodo II' }
  ];

  // Obtener el año actual para el campo year
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título del Curso *
        </label>
        <input
          type="text"
          name="title"
          value={courseData.title || ''}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          required
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          value={courseData.description || ''}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Período Académico *
          </label>
          <select
            name="period"
            value={courseData.period || 'I'}  // Valor por defecto 'I' como en el modelo
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${errors.period ? 'border-red-500' : 'border-gray-300'}`}
            required
          >
            {periodOptions.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          {errors.period && <p className="mt-1 text-sm text-red-600">{errors.period}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año
          </label>
          <input
            type="number"
            name="year"
            value={courseData.year || currentYear}  // Año actual por defecto
            onChange={handleChange}
            min="2000"
            max="2100"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default CourseBasicInfo;