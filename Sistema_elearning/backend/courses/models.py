from django.db import models

class Course(models.Model):
	title = models.CharField(max_length=100)
	description = models.TextField()

class Module(models.Model):
	course = models.ForeignKey(Course, on_delete=models.CASCADE)
	title = models.CharField(max_length=100)