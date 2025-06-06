from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView  # <-- Este import es crucial
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer  # <-- Añade este
from django.contrib.auth import get_user_model


User = get_user_model()

class RegisterView(APIView):
    """
    Vista para registro de nuevos usuarios (estudiantes/profesores)
    """
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Personaliza la respuesta según tu modelo User
            response_data = {
                'id': user.id,
                'email': user.email,
                'role': user.role,
                'message': 'Usuario registrado exitosamente'
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Verificación adicional para profesores
        if not self.user.is_active:
            raise serializers.ValidationError("Cuenta inactiva")
            
        if hasattr(self.user, 'role') and self.user.role == 'teacher' and not getattr(self.user, 'is_verified', True):
            raise serializers.ValidationError("Profesor no verificado. Contacta al administrador.")
        
        # Datos adicionales en la respuesta
        data.update({
            'email': self.user.email,
            'user_id': self.user.id,
            'role': getattr(self.user, 'role', 'student')
        })
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserDetailView(RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            data = {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'cedula': user.cedula,
                'is_verified': user.is_verified
            }
            return Response(data)
        except Exception as e:
            print("Error en CurrentUserView:", str(e))  # Ver en consola Django
            return Response(
                {"error": "Error al obtener datos del usuario"}, 
                status=500
            )