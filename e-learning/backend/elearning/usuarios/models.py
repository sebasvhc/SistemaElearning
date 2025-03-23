from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


# Create your models here.
class UsuarioManager(BaseUserManager):
    def create_user(self, cedula, email, password=None, **extra_fields):
        if not cedula:
            raise ValueError("The cedula field must be set")

        email = self.normalize_email(email)
        user = self.model(cedula=cedula, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, cedula, email, password=None, **extra_fields):
        extra_fields["username"] = cedula
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(cedula, email, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    cedula = models.CharField(max_length=9, unique=True)
    username = models.CharField(max_length=150, unique=True)
    nombres = models.CharField(max_length=40)
    apellidos = models.CharField(max_length=40)
    f_nacimiento = models.DateField(null=True, blank=True)
    f_registro = models.DateField(auto_now_add=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = "cedula"
    REQUIRED_FIELDS = ["email", "nombres", "apellidos", "f_nacimiento"]

    def __str__(self):
        return self.username

