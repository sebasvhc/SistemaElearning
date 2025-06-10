from rest_framework import serializers
from .models import Course
from django.contrib.auth import get_user_model  # Importa esta función

# Obtiene el modelo User real
User = get_user_model()

class CourseSerializer(serializers.ModelSerializer):
    teacher_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='teacher'),
        source='teacher',
        write_only=True
    )
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'teacher', 'teacher_id', 'students', 'created_at']
        read_only_fields = ['teacher', 'created_at']
        extra_kwargs = {
            'students': {'required': False}
        }