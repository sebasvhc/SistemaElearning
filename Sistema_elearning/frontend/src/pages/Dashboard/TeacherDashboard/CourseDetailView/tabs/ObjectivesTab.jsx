import React, { useState } from 'react';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../../../components/common/Button';

const ObjectivesTab = ({ objectives, courseId }) => {
  const [newObjective, setNewObjective] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempObjective, setTempObjective] = useState('');

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    
    const updatedObjectives = [...objectives, {
      description: newObjective.trim(),
      order: objectives.length + 1
    }];
    
    // Aquí deberías llamar a tu API para guardar el objetivo
    console.log('Objetivo añadido:', newObjective);
    setNewObjective('');
  };

  const handleEditStart = (index) => {
    setEditingIndex(index);
    setTempObjective(objectives[index].description);
  };

  const handleEditSave = (index) => {
    const updatedObjectives = [...objectives];
    updatedObjectives[index].description = tempObjective;
    // Aquí deberías llamar a tu API para actualizar el objetivo
    console.log('Objetivo actualizado:', tempObjective);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const objectiveToDelete = objectives[index];
    // Aquí deberías llamar a tu API para eliminar el objetivo
    console.log('Objetivo a eliminar:', objectiveToDelete);
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-medium text-lg mb-4">Agregar nuevo objetivo</h3>
        
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            placeholder="Escribe un objetivo instruccional"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            onKeyPress={(e) => e.key === 'Enter' && handleAddObjective()}
          />
          <Button
            onClick={handleAddObjective}
            variant="primary"
            size="small"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg">
        <h3 className="font-medium text-lg p-4">Objetivos del curso</h3>
        
        {objectives.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No hay objetivos definidos
          </div>
        ) : (
          <ul className="divide-y">
            {objectives.map((obj, index) => (
              <li key={index} className="p-4">
                {editingIndex === index ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tempObjective}
                      onChange={(e) => setTempObjective(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded"
                      autoFocus
                    />
                    <Button
                      onClick={() => handleEditSave(index)}
                      variant="success"
                      size="small"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-start">
                      <span className="mr-3 font-medium text-gray-500">{index + 1}.</span>
                      <span>{obj.description}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEditStart(index)}
                        variant="ghost"
                        size="small"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(index)}
                        variant="danger"
                        size="small"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ObjectivesTab;