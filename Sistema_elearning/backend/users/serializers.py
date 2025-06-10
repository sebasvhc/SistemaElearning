from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from .models import User 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Cambia 'username' por 'email' para que coincida con tu modelo User
        attrs['email'] = attrs.pop('username', None)
        return super().validate(attrs)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Agrega campos personalizados al token (opcional)
        token['email'] = user.email
        token['role'] = user.role
        return token


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    cedula = serializers.CharField(
        required=True,  # Ahora es requerido para todos
        allow_blank=False,
        max_length=20
    )

    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'first_name', 
            'last_name', 
            'role',
            'cedula',
            'password',  # Añadir password a los fields
            'is_verified'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'cedula': {'required': True}  # Ahora es obligatorio
        }

    def validate(self, data):
        # Validación adicional si es necesaria
        if len(data.get('password', '')) < 8:
            raise serializers.ValidationError({
                'password': 'La contraseña debe tener al menos 8 caracteres'
            })
        return data

    def create(self, validated_data):
        # Asegurarse de procesar correctamente todos los campos
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'student'),
            cedula=validated_data['cedula']  # Ahora es requerido
        )
        return user