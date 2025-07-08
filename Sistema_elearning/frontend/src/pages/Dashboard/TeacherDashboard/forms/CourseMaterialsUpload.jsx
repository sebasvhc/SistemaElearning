import { useState } from 'react';
import { 
  PaperClipIcon, 
  TrashIcon, 
  CloudArrowUpIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const CourseMaterialsUpload = ({ materials, updateMaterials, courseId }) => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    material_type: 'DOC',
    url: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setSelectedFiles(filesArray);
    
    // Establecer títulos automáticos si no hay título especificado
    if (!newMaterial.title && filesArray.length === 1) {
      setNewMaterial(prev => ({
        ...prev,
        title: filesArray[0].name.split('.')[0] // Usar nombre del archivo sin extensión
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial({
      ...newMaterial,
      [name]: value
    });
  };

  const removeSelectedFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleAddMaterial = async () => {
    if (selectedFiles.length === 0 && !newMaterial.url) {
      alert('Debes seleccionar al menos un archivo o proporcionar una URL');
      return;
    }
    
    if (!newMaterial.title) {
      alert('Por favor ingresa un título para el material');
      return;
    }

    setUploading(true);
    
    try {
      if (selectedFiles.length > 0) {
        // Subida múltiple de archivos
        const formData = new FormData();
        
        // Agregar metadatos comunes
        formData.append('title', newMaterial.title);
        formData.append('material_type', newMaterial.material_type);
        formData.append('course_id', courseId);
        
        // Agregar cada archivo con su nombre original
        selectedFiles.forEach((file, index) => {
          formData.append(`files[${index}]`, file);
        });

        const response = await fetch(`/api/courses/${courseId}/materials/bulk/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        const result = await response.json();
        updateMaterials([...materials, ...result.uploaded_materials]);
      } else {
        // Subida de URL
        const response = await fetch(`/api/courses/${courseId}/materials/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title: newMaterial.title,
            material_type: newMaterial.material_type,
            url: newMaterial.url
          })
        });
        
        const materialData = await response.json();
        updateMaterials([...materials, materialData]);
      }
      
      // Resetear el formulario
      setNewMaterial({
        title: '',
        material_type: 'DOC',
        url: ''
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error uploading material:', error);
      alert('Error al subir el material. Por favor intenta nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este material?')) return;
    
    try {
      await fetch(`/api/courses/materials/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      updateMaterials(materials.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Error al eliminar el material');
    }
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
              placeholder="Nombre descriptivo del material"
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
              <option value="DOC">Documento (PDF, Word, etc.)</option>
              <option value="VID">Video</option>
              <option value="LNK">Enlace web</option>
              <option value="PPT">Presentación</option>
              <option value="IMG">Imágenes</option>
            </select>
          </div>
          
          {newMaterial.material_type !== 'LNK' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {selectedFiles.length > 0 ? 'Archivos seleccionados' : 'Seleccionar archivos *'}
              </label>
              
              {selectedFiles.length > 0 ? (
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                      <div className="flex items-center">
                        <PaperClipIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <span className="truncate max-w-xs">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                  <CloudArrowUpIcon className="h-10 w-10 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-600">
                    Haz clic para seleccionar archivos
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    Puedes seleccionar múltiples archivos
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />
                </label>
              )}
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
          
          <button
            onClick={handleAddMaterial}
            disabled={uploading || (selectedFiles.length === 0 && !newMaterial.url) || !newMaterial.title}
            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-white font-medium transition-colors ${
              uploading 
                ? 'bg-indigo-400' 
                : (selectedFiles.length === 0 && !newMaterial.url) || !newMaterial.title 
                  ? 'bg-indigo-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subiendo...
              </>
            ) : (
              <>
                <CheckIcon className="h-5 w-5 mr-2" />
                {selectedFiles.length > 1 ? `Subir ${selectedFiles.length} archivos` : 'Agregar Material'}
              </>
            )}
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-lg mb-4">Materiales del curso</h3>
        
        {materials.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed">
            No hay materiales agregados aún
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map((material) => (
              <div key={material.id} className="border rounded-lg p-4 flex justify-between items-center bg-white hover:shadow-sm transition-shadow">
                <div className="flex items-center min-w-0">
                  <PaperClipIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-medium truncate">{material.title}</h4>
                    <p className="text-sm text-gray-500 truncate">
                      {material.material_type === 'LNK' ? 'Enlace' : 
                       material.material_type === 'VID' ? 'Video' :
                       material.material_type === 'PPT' ? 'Presentación' : 
                       material.material_type === 'IMG' ? 'Imagen' : 'Documento'}
                      {material.created_at && ` • ${new Date(material.created_at).toLocaleDateString()}`}
                      {material.file_name && ` • ${material.file_name}`}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {material.url && (
                    <a 
                      href={material.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Abrir enlace"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteMaterial(material.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Eliminar material"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseMaterialsUpload;