
from django.urls import path
from rooms import views

urlpatterns = [
    path('index/', views.Sala.as_view(), name='index'),
]