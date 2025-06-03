from django.conf import settings
from django.db import models

# Usa esto para las relaciones ForeignKey
User = settings.AUTH_USER_MODEL


class Course(models.Model):
    title = models.CharField(max_length=200)
    teacher = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    limit_choices_to={'role': 'teacher'},
    null=False  # Ahora es requerido
)

