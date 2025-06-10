from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None  # Desactivamos el campo username
    email = models.EmailField(unique=True)
    
    ROLES = (
        ('student', 'Estudiante'),
        ('teacher', 'Profesor'),
        ('admin', 'Administrador'),
    )
    role = models.CharField(max_length=10, choices=ROLES, default='student')
    cedula = models.CharField(max_length=20, blank=True, null=True, unique=True)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'  # Usamos email como campo de login
    REQUIRED_FIELDS = ['role']  # Campos requeridos para createsuperuser

    objects = UserManager()

    def __str__(self):
        return self.email