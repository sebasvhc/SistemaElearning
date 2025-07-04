import { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import CourseInfoTab from "./tabs/CourseInfoTab";
import MaterialsTab from "./tabs/MaterialsTab";
import ObjectivesTab from "./tabs/ObjectivesTab";
import EvaluationsTab from "./tabs/EvaluationsTab";
import ResultsTab from "./tabs/ResultsTab";

const CourseDetailView = ({ course, onQuizCreated }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [courseData, setCourseData] = useState(course);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const updateCourseData = (newData) => {
    setCourseData(newData);
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{courseData.title}</h2>
        <div className="flex items-center mt-2 text-gray-600">
          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mr-3">
            {courseData.period}-{courseData.year}
          </span>
          <span>{courseData.student_count || 0} estudiantes</span>
        </div>
        {courseData.description && (
          <p className="mt-3 text-gray-700">{courseData.description}</p>
        )}
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Información" value="info" />
          <Tab label="Objetivos" value="objectives" />
          <Tab label="Materiales" value="materials" />
          <Tab label="Evaluaciones" value="evaluations" />
          <Tab label="Resultados" value="results" />
        </Tabs>
      </Box>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {activeTab === 'info' && (
          <CourseInfoTab 
            course={courseData} 
            updateCourse={updateCourseData} 
          />
        )}
        
        {activeTab === 'objectives' && (
          <ObjectivesTab 
            objectives={courseData.objectives || []} 
            courseId={courseData.id} 
          />
        )}
        
        {activeTab === 'materials' && (
          <MaterialsTab 
            materials={courseData.materials || []} 
            courseId={courseData.id} 
          />
        )}
        
        {activeTab === 'evaluations' && (
          <EvaluationsTab 
            quizzes={courseData.quizzes || []} 
            courseId={courseData.id} 
            onQuizCreated={onQuizCreated}
          />
        )}
        
        {activeTab === 'results' && (
          <ResultsTab 
            courseId={courseData.id} 
          />
        )}
      </div>
    </div>
  );
};

export default CourseDetailView;