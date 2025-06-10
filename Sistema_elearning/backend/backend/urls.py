from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from courses.views import CourseViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import (
    RegisterView,
    CustomTokenObtainPairView,
    UserDetailView
)

router = DefaultRouter()
router.register(r'api/courses', CourseViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    
    # Autenticación JWT
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Usa solo tu vista personalizada
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Users
    path('api/users/register/', RegisterView.as_view(), name='register'),
    path('api/users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    
    # Apps
    path('api/users/', include('users.urls')),
    path('api/courses/', include('courses.urls')),
]