from .models import Usuario
from rest_framework import serializers


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            "cedula",
            "username",
            "nombres",
            "apellidos",
            "f_nacimiento",
            "email",
        ]

