from rest_framework.serializers import serializers
from . import models


class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Usuarios
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "cedual",
            "telefono",
            "fecha_nacimiento",
        ]
        extra_kwargs = {"password": {"write_only": True}}
