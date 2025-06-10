# courses/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, StudentCoursesList

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')

urlpatterns = [
    # API View tradicional
    path('student/courses/', StudentCoursesList.as_view(), name='student-courses'),
    
    # ViewSet routes
    path('', include(router.urls)),
]