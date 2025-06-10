from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from .models import Course
from .serializers import CourseSerializer
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied

User = settings.AUTH_USER_MODEL

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filtra cursos según el rol del usuario"""
        user = self.request.user
        
        if user.role == 'teacher':
            return Course.objects.filter(teacher=user)
        elif user.role == 'student':
            return Course.objects.filter(students__id=user.id)
        else:
            return Course.objects.none()

    @action(detail=False, methods=['get'], url_path='teacher/courses')
    def teacher_courses(self, request):
        """Endpoint específico para cursos del profesor"""
        if request.user.role != 'teacher':
            return Response(
                {"detail": "Solo los profesores pueden acceder a este recurso"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        courses = Course.objects.filter(teacher=request.user)
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

class StudentCoursesList(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # Verificar que el usuario es un estudiante
        if user.role != 'student':
            raise PermissionDenied(
                detail="Solo los estudiantes pueden acceder a esta vista",
                code=status.HTTP_403_FORBIDDEN
            )
        
        # Obtener cursos donde el usuario es estudiante
        return Course.objects.filter(students__id=user.id).select_related('teacher')
    
    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except PermissionDenied as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_403_FORBIDDEN
            )
        except Exception as e:
            return Response(
                {"detail": "Error al obtener los cursos"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )