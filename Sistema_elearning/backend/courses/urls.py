# courses/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet,
    StudentCoursesList,
    TeacherCoursesView,
    QuizViewSet,
    QuestionViewSet,
    GamificationViewSet,
    QuizSubmissionViewSet,
    StudentQuizListView,
    CourseViewSet
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(
    r'quizzes/(?P<quiz_pk>\d+)/questions', 
    QuestionViewSet, 
    basename='question'
)
router.register(
    r'quizzes/(?P<quiz_pk>\d+)/gamification',
    GamificationViewSet,
    basename='gamification'
)
router.register(
    r'quiz-submissions',
    QuizSubmissionViewSet,
    basename='quizsubmission'
)

urlpatterns = [
    path('', include(router.urls)),
    path('student-courses/', StudentCoursesList.as_view(), name='student-courses'),
    path('teacher-courses/', TeacherCoursesView.as_view(), name='teacher-courses'),
    path('student-quizzes/', StudentQuizListView.as_view(), name='student-quizzes'),
]