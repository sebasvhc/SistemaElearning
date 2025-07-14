import React, { useState } from 'react';
import { Form, Input, Button, InputNumber, Select, message } from 'antd';
import api from '@/api/api';

const CreateQuizForm = ({ courseId, objectives = [], onSuccess }) => {
  const [form] = Form.useForm();
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const calculateTotal = (objectives) => {
    return objectives?.reduce((sum, obj) => sum + (obj.points || 0), 0);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // Validación de puntos
      const currentObjectives = values.objectives || [];
      const total = calculateTotal(currentObjectives);
      
      if (total > 20) {
        throw new Error('El total de puntos no puede exceder 20');
      }

      // Preparar datos para el backend
      const quizData = {
        title: values.title,
        description: values.description || '',
        max_points: values.max_points || 20,
        course: courseId,
        objectives: currentObjectives.map(obj => ({
          objective: obj.objective,
          points: obj.points
        }))
      };

      // Llamada API directa
      const response = await api.post(`/courses/${courseId}/quizzes/`, quizData);
      
      message.success('Evaluación creada exitosamente');
      onSuccess(response.data);
      form.resetFields();
      setTotalPoints(0);
    } catch (error) {
      console.error('Error creating quiz:', error);
      message.error(
        error.response?.data?.message || 
        error.message || 
        'Error al crear evaluación'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="title"
        label="Título"
        rules={[{ required: true, message: 'Ingresa un título' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        name="max_points"
        label="Puntos Máximos (20)"
        initialValue={20}
        rules={[{ required: true }]}
      >
        <InputNumber min={1} max={20} disabled />
      </Form.Item>
      
      <Form.List name="objectives">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item
                  {...restField}
                  name={[name, 'objective']}
                  label="Objetivo"
                  style={{ flex: 2, marginRight: 8 }}
                  rules={[{ required: true, message: 'Selecciona un objetivo' }]}
                >
                  <Select 
                    options={objectives.map(obj => ({
                      value: obj.id,
                      label: `${obj.description} (${obj.weight}%)`
                    }))} 
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'points']}
                  label="Puntos"
                  style={{ flex: 1 }}
                  rules={[{ required: true, message: 'Ingresa puntos' }]}
                >
                  <InputNumber 
                    min={1} 
                    max={20}
                    onChange={() => {
                      const currentObjectives = form.getFieldValue('objectives') || [];
                      setTotalPoints(calculateTotal(currentObjectives));
                    }}
                  />
                </Form.Item>
              </div>
            ))}
            <Form.Item>
              <Button 
                type="dashed" 
                onClick={() => add()}
                disabled={objectives.length === 0}
              >
                Añadir Objetivo
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      
      <div style={{ marginBottom: 16 }} className={totalPoints > 20 ? 'text-red-500' : ''}>
        <strong>Total de puntos asignados: {totalPoints}/20</strong>
        {totalPoints > 20 && <p className="text-sm">¡Excede el límite!</p>}
      </div>
      
      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit"
          loading={loading}
          disabled={totalPoints > 20}
        >
          Crear Evaluación
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateQuizForm;