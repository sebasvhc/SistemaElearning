from django.urls import path
from .views import RegisterView, CurrentUserView  # Añade CurrentUserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', CurrentUserView.as_view(), name='current-user'),  # Nueva ruta
]