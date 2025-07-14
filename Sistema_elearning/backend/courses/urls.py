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
    CourseViewSet,
    CompleteCourseCreateView,
    QuizCreateView,
    FinalizeCourseView,
    PeriodListView
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
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
    path('teacher/', TeacherCoursesView.as_view(), name='teacher-courses'),
    path('periods/', PeriodListView.as_view(), name='period-list'),
    path('create-complete/', CompleteCourseCreateView.as_view(), name='create-complete-course'),
    path('student-courses/', StudentCoursesList.as_view(), name='student-courses'),
    path('student-quizzes/', StudentQuizListView.as_view(), name='student-quizzes'),
    path('courses/<int:course_id>/quizzes/', QuizCreateView.as_view(), name='create-quiz'),
    path('courses/<int:course_id>/finalize/', FinalizeCourseView.as_view(), name='finalize-course'),
]