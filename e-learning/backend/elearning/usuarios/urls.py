from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.Login.as_view()),
    # path('userregister/', UsuarioRegister.as_view(),name='register'),
]
