import { useState } from 'react';
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import CourseBasicInfo from './CourseBasicInfo';
import InstructionalObjectivesForm from '../forms/InstructionalObjectivesForm';
import CourseMaterialsUpload from '../forms/CourseMaterialsUpload';
import CreateQuizForm from '../forms/CreateQuizForm';
import { Button }  from '../../../../components/common/Button';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const steps = [
  'Información Básica',
  'Objetivos Instruccionales',
  'Materiales Curriculares',
  'Evaluaciones'
];

const CourseCreationWizard = ({ periods, teacherId, onSuccess, onCancel }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    period: periods[0]?.value || 'I',
    year: new Date().getFullYear(),
    teacher_id: teacherId,
    objectives: [],
    materials: [],
    quizzes: []
  });
  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!courseData.title.trim()) newErrors.title = 'El título es requerido';
      if (!courseData.period) newErrors.period = 'Selecciona un período';
    }
    
    if (step === 1 && courseData.objectives.length === 0) {
      newErrors.objectives = 'Debe agregar al menos un objetivo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/courses/create-complete/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(courseData)
      });
      
      if (!response.ok) throw new Error('Error al crear el curso');
      
      const newCourse = await response.json();
      onSuccess(newCourse);
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const updateCourseData = (field, value) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ mt: 4 }}>
        {activeStep === 0 && (
          <CourseBasicInfo 
            courseData={courseData}
            periods={periods}
            updateCourseData={updateCourseData}
            errors={errors}
          />
        )}
        
        {activeStep === 1 && (
          <InstructionalObjectivesForm 
            objectives={courseData.objectives}
            updateObjectives={(objs) => updateCourseData('objectives', objs)}
            error={errors.objectives}
          />
        )}
        
        {activeStep === 2 && (
          <CourseMaterialsUpload 
            materials={courseData.materials}
            updateMaterials={(mats) => updateCourseData('materials', mats)}
            courseId={courseData.id}
          />
        )}
        
        {activeStep === 3 && (
          <CreateQuizForm 
            quizzes={courseData.quizzes}
            updateQuizzes={(qz) => updateCourseData('quizzes', qz)}
            courseId={courseData.id}
          />
        )}
      </Box>

      {errors.submit && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-r-lg">
          <p>{errors.submit}</p>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <div>
          {activeStep > 0 && (
            <Button 
              onClick={handleBack}
              variant="outline"
              className="mr-4"
              startIcon={<ArrowLeftIcon className="h-5 w-5" />}
            >
              Atrás
            </Button>
          )}
          <Button 
            onClick={onCancel}
            variant="outline"
          >
            Cancelar
          </Button>
        </div>
        
        <div>
          {activeStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext}
              variant="primary"
              endIcon={<PlusIcon className="h-5 w-5" />}
            >
              Siguiente
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              variant="primary"
              endIcon={<CheckIcon className="h-5 w-5" />}
            >
              Finalizar Curso
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCreationWizard;