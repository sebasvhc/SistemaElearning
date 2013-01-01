import { useState } from 'react';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';

const InstructionalObjectivesForm = ({ objectives, updateObjectives, error }) => {
  const [newObjective, setNewObjective] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempObjective, setTempObjective] = useState('');

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    
    const updatedObjectives = [...objectives, {
      description: newObjective.trim(),
      order: objectives.length + 1
    }];
    
    updateObjectives(updatedObjectives);
    setNewObjective('');
  };

  const handleEditStart = (index) => {
    setEditingIndex(index);
    setTempObjective(objectives[index].description);
  };

  const handleEditSave = (index) => {
    const updatedObjectives = [...objectives];
    updatedObjectives[index].description = tempObjective;
    updateObjectives(updatedObjectives);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedObjectives = objectives.filter((_, i) => i !== index)
      .map((obj, i) => ({ ...obj, order: i + 1 }));
    updateObjectives(updatedObjectives);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newObjective}
          onChange={(e) => setNewObjective(e.target.value)}
          placeholder="Nuevo objetivo instruccional"
          className="flex-1 p-3 border border-gray-300 rounded-lg"
          onKeyPress={(e) => e.key === 'Enter' && handleAddObjective()}
        />
        <button
          onClick={handleAddObjective}
          className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      
      {error && <p className="text-sm text-red-600">{error}</p>}
      
      <div className="border rounded-lg divide-y">
        {objectives.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No hay objetivos agregados
          </div>
        ) : (
          objectives.map((obj, index) => (
            <div key={index} className="p-4 flex justify-between items-center">
              {editingIndex === index ? (
                <input
                  type="text"
                  value={tempObjective}
                  onChange={(e) => setTempObjective(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  autoFocus
                />
              ) : (
                <div className="flex items-start">
                  <span className="mr-3 font-medium text-gray-500">{index + 1}.</span>
                  <span>{obj.description}</span>
                </div>
              )}
              
              <div className="flex space-x-2">
                {editingIndex === index ? (
                  <button
                    onClick={() => handleEditSave(index)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                  >
                    <CheckIcon className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditStart(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InstructionalObjectivesForm;