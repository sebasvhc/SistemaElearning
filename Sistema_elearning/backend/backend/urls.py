from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from courses.views import CourseViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import UserDetailView


router = DefaultRouter()
router.register(r'api/courses', CourseViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('api/courses/', include('courses.urls')),
    path('api/', include('users.urls')),  # Asegúrate de incluir esto
    path('api/', include('courses.urls')),
]