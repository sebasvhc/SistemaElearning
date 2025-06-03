from django.shortcuts import render
from rest_framework import viewsets
from .models import Course
from .serializers import CourseSerializer
from django.http import JsonResponse


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer



def course_list(request):
    courses = Course.objects.all()
    data = [{"id": course.id, "title": course.title} for course in courses]
    return JsonResponse(data, safe=False)