import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import api from "../../../../api/api";

const FinalizeCourseButton = ({ courseId, onFinalized }) => {
  const [loading, setLoading] = useState(false);
  
  const handleFinalize = async () => {
    Modal.confirm({
      title: '¿Estás seguro de finalizar este curso?',
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez finalizado, no podrás hacer cambios en los objetivos o evaluaciones.',
      okText: 'Finalizar',
      cancelText: 'Cancelar',
      onOk: async () => {
        setLoading(true);
        try {
          await api.post(`/courses/${courseId}/finalize/`);
          message.success('Curso finalizado exitosamente');
          onFinalized();
        } catch (error) {
          message.error(error.response?.data?.error || 'Error al finalizar el curso');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <Button 
      type="primary" 
      onClick={handleFinalize}
      loading={loading}
    >
      Finalizar Curso
    </Button>
  );
};

export default FinalizeCourseButton;