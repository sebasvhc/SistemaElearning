import React, { useState } from 'react';
import { PaperClipIcon, TrashIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../../../components/common/Button.jsx';

const MaterialsTab = ({ materials, courseId }) => {
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    material_type: 'DOC',
    file: null,
    url: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setNewMaterial({
      ...newMaterial,
      file: e.target.files[0],
      title: e.target.files[0]?.name || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial({
      ...newMaterial,
      [name]: value
    });
  };

  const handleAddMaterial = async () => {
    if ((!newMaterial.file && !newMaterial.url) || !newMaterial.title) return;
    
    setIsUploading(true);
    try {
      // Aquí iría la lógica para subir el material al backend
      console.log('Subiendo material:', newMaterial);
      // Simulamos una subida con timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Limpiar el formulario después de subir
      setNewMaterial({
        title: '',
        material_type: 'DOC',
        file: null,
        url: ''
      });
    } catch (error) {
      console.error('Error al subir material:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    // Lógica para eliminar material
    console.log('Eliminando material con ID:', materialId);
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-medium text-lg mb-4">Agregar nuevo material</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={newMaterial.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Material *
            </label>
            <select
              name="material_type"
              value={newMaterial.material_type}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="DOC">Documento</option>
              <option value="VID">Video</option>
              <option value="LNK">Enlace</option>
              <option value="PPT">Presentación</option>
            </select>
          </div>
          
          {newMaterial.material_type !== 'LNK' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Archivo *
              </label>
              <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                {newMaterial.file ? (
                  <div className="flex items-center text-green-600">
                    <PaperClipIcon className="h-5 w-5 mr-2" />
                    <span>{newMaterial.file.name}</span>
                  </div>
                ) : (
                  <>
                    <CloudArrowUpIcon className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-600">
                      Haz clic para seleccionar un archivo
                    </span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL *
              </label>
              <input
                type="url"
                name="url"
                value={newMaterial.url}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/material"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}
          
          <Button
            onClick={handleAddMaterial}
            disabled={isUploading || (!newMaterial.file && !newMaterial.url) || !newMaterial.title}
            variant="primary"
            className="w-full"
          >
            {isUploading ? 'Subiendo...' : 'Agregar Material'}
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-lg mb-4">Materiales del curso</h3>
        
        {materials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay materiales agregados
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map((material) => (
              <div key={material.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <PaperClipIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{material.title}</h4>
                    <p className="text-sm text-gray-500">
                      {material.material_type === 'LNK' ? 'Enlace' : 
                       material.material_type === 'VID' ? 'Video' :
                       material.material_type === 'PPT' ? 'Presentación' : 'Documento'}
                      {material.created_at && ` • ${new Date(material.created_at).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMaterial(material.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsTab;