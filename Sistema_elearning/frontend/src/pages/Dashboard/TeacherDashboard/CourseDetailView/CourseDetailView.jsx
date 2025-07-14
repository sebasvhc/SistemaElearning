// pages/Dashboard/TeacherDashboard/CourseDetailView/CourseDetailView.jsx
import React, { useState, useEffect } from 'react';
import { Tabs, Card, message } from 'antd';
import FinalizeCourseButton from '../components/FinalizeCourseButton';
import CourseInfoTab from './tabs/CourseInfoTab';
import EvaluationsTab from './tabs/EvaluationsTab';
import MaterialsTab from './tabs/MaterialsTab';
import ObjectivesTab from './tabs/ObjectivesTab';
import ResultsTab from './tabs/ResultsTab';
import api from '../../../../api/api';

const { TabPane } = Tabs;

const CourseDetailView = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${courseId}/`);
        setCourse(response.data);
      } catch (error) {
        message.error('Error al cargar el curso');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);

  const handleCourseFinalized = () => {
    setCourse(prev => ({ ...prev, is_finalized: true }));
    message.success('Curso finalizado exitosamente');
  };

  if (loading) return <div>Cargando...</div>;
  if (!course) return <div>Curso no encontrado</div>;

  return (
    <div className="course-detail-view">
      <Card
        title={course.title}
        extra={
          !course.is_finalized && (
            <FinalizeCourseButton 
              courseId={course.id} 
              onFinalized={handleCourseFinalized}
            />
          )
        }
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Información" key="1">
            <CourseInfoTab course={course} />
          </TabPane>
          <TabPane tab="Evaluaciones" key="2">
            <EvaluationsTab course={course} />
          </TabPane>
          <TabPane tab="Materiales" key="3">
            <MaterialsTab course={course} />
          </TabPane>
          <TabPane tab="Objetivos" key="4">
            <ObjectivesTab course={course} />
          </TabPane>
          <TabPane tab="Resultados" key="5">
            <ResultsTab course={course} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CourseDetailView;