from django.urls import path
from . import views

urlpatterns = [
    # path("login/", Login.as_view(), name="login"),
    path("csrf_token/", views.get_csrf_token, name="csrf_token"),
    path("register/", views.Register.as_view(), name="register"),
]
