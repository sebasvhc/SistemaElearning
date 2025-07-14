import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';

const InstructionalObjectivesForm = ({ objectives, updateObjectives, error }) => {
  const [newObjective, setNewObjective] = useState({
    description: '',
    weight: ''
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempObjective, setTempObjective] = useState({
    description: '',
    weight: ''
  });
  const [totalWeight, setTotalWeight] = useState(0);

  // Calcular el peso total
  useEffect(() => {
    const sum = objectives.reduce((total, obj) => total + (parseInt(obj.weight) || 0), 0);
    setTotalWeight(sum);
  }, [objectives]);

  const handleAddObjective = () => {
    if (!newObjective.description.trim()) {
      alert('Por favor ingresa una descripción para el objetivo');
      return;
    }
    
    if (!newObjective.weight || isNaN(newObjective.weight)) {
      alert('Por favor ingresa un porcentaje válido');
      return;
    }
    
    const weight = parseInt(newObjective.weight);
    const remainingWeight = 100 - totalWeight;
    
    if (weight > remainingWeight) {
      alert(`Solo puedes asignar hasta ${remainingWeight}% (total actual: ${totalWeight}%)`);
      return;
    }
    
    const updatedObjectives = [...objectives, {
      description: newObjective.description.trim(),
      weight: weight.toString(),
      order: objectives.length + 1
    }];
    
    updateObjectives(updatedObjectives);
    setNewObjective({ description: '', weight: '' });
  };

  const handleEditStart = (index) => {
    setEditingIndex(index);
    setTempObjective({
      description: objectives[index].description,
      weight: objectives[index].weight
    });
  };

  const handleEditSave = (index) => {
    if (!tempObjective.description.trim() || !tempObjective.weight) {
      alert('Por favor completa ambos campos');
      return;
    }
    
    const currentWeight = parseInt(objectives[index].weight);
    const newWeight = parseInt(tempObjective.weight);
    const weightDifference = newWeight - currentWeight;
    
    if (totalWeight + weightDifference > 100) {
      alert(`No puedes exceder el 100% (actual: ${totalWeight}%)`);
      return;
    }
    
    const updatedObjectives = [...objectives];
    updatedObjectives[index] = {
      ...updatedObjectives[index],
      description: tempObjective.description,
      weight: tempObjective.weight
    };
    
    updateObjectives(updatedObjectives);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedObjectives = objectives.filter((_, i) => i !== index)
      .map((obj, i) => ({ ...obj, order: i + 1 }));
    updateObjectives(updatedObjectives);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddObjective();
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del objetivo
          </label>
          <input
            type="text"
            value={newObjective.description}
            onChange={(e) => setNewObjective({
              ...newObjective,
              description: e.target.value
            })}
            placeholder="Ej: Comprender los fundamentos de álgebra"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onKeyPress={handleKeyPress}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (%)
          </label>
          <div className="flex">
            <input
              type="number"
              min="1"
              max="100"
              value={newObjective.weight}
              onChange={(e) => setNewObjective({
                ...newObjective,
                weight: e.target.value
              })}
              placeholder="0-100"
              className="w-full p-3 border border-gray-300 rounded-lg"
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleAddObjective}
              className="ml-2 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className={`p-2 rounded-md ${
        totalWeight === 100 ? 'bg-green-50 text-green-700' : 
        totalWeight > 100 ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
      }`}>
        <div className="flex justify-between items-center">
          <span>Peso total asignado:</span>
          <span className="font-medium">
            {totalWeight}% / 100%
            {totalWeight > 100 && ' (¡Excede el límite!)'}
            {totalWeight === 100 && ' (Completo)'}
          </span>
        </div>
      </div>
      
      {error && <p className="text-sm text-red-600">{error}</p>}
      
      <div className="border rounded-lg divide-y">
        {objectives.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No hay objetivos agregados aún
          </div>
        ) : (
          objectives.map((obj, index) => (
            <div key={index} className="p-4">
              {editingIndex === index ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={tempObjective.description}
                      onChange={(e) => setTempObjective({
                        ...tempObjective,
                        description: e.target.value
                      })}
                      className="w-full p-2 border border-gray-300 rounded"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={tempObjective.weight}
                      onChange={(e) => setTempObjective({
                        ...tempObjective,
                        weight: e.target.value
                      })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <span className="mx-2">%</span>
                    <button
                      onClick={() => handleEditSave(index)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      <span className="text-gray-500 mr-2">{index + 1}.</span>
                      {obj.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Peso: {obj.weight}% del curso
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditStart(index)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InstructionalObjectivesForm;