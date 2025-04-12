from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
import re
from datetime import datetime
from django.middleware.csrf import get_token
from django.http import JsonResponse
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from django.contrib.auth import authenticate

from . import models


# -------------------TOKEN-----------------------------|
def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({"csrfToken": token})


# -------------------------REGISTER-------------------|
class Register(APIView):
    def post(self, request):
        try:
            data = request.data

            # Validación de campos requeridos
            required_fields = [
                "firstName",
                "lastName",
                "cedula",
                "nickName",
                "phone",
                "email",
                "password",
                "confirmPassword",
                "birthDate",
            ]
            for field in required_fields:
                if field not in data:
                    return Response(
                        {"error": f"El campo {field} es requerido"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # Validación de contraseñas
            if data["password"] != data["confirmPassword"]:
                return Response(
                    {"error": "Las contraseñas no coinciden"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validación de cédula (ejemplo para Venezuela)
            if not re.match(r"^\d{7,8}$", data["cedula"]):
                return Response(
                    {"error": "La cédula debe tener entre 7 y 8 dígitos numéricos"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validación de email único
            if models.Usuario.objects.filter(email=data["email"]).exists():
                return Response(
                    {"error": "Este correo electrónico ya está registrado"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validación de nombre de usuario único
            if models.Usuario.objects.filter(username=data["nickName"]).exists():
                return Response(
                    {"error": "Este nombre de usuario ya está en uso"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validación de cédula única
            if models.Usuario.objects.filter(cedula=data["cedula"]).exists():
                return Response(
                    {"error": "Esta cédula ya está registrada"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validación de fecha de nacimiento
            try:
                birth_date = datetime.strptime(data["birthDate"], "%Y-%m-%d").date()
                if birth_date > datetime.now().date():
                    return Response(
                        {"error": "La fecha de nacimiento no puede ser futura"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except ValueError:
                return Response(
                    {"error": "Formato de fecha inválido. Use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Creación del usuario
            user = models.Usuario(
                nombres=data["firstName"],
                apellidos=data["lastName"],
                username=data["nickName"],
                cedula=data["cedula"],
                telefono=data["phone"],
                email=data["email"],
                password=make_password(data["password"]),
                fecha_nacimiento=birth_date,
                is_active=True,  # Puedes cambiar esto si necesitas verificación por email
            )
            user.save()

            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response(
                {
                    "message": "Usuario registrado exitosamente",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "nombres": user.nombres,
                        "apellidos": user.apellidos,
                    },
                    "tokens": {"refresh": str(refresh), "access": access_token},
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"error": f"Error en el servidor: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ----------------------LOGIN-------------------------|
"""
class Login(APIView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request):
        user = {
            "cedula": "",
            "password": "",
        }
        if models.Usuario.objects.filter(username=request.data["username"]).exists():
            user["cedula"] = models.Usuario.objects.get(
                username=request.data["username"]
            ).cedula
            user["password"] = request.data["password"]

        elif models.Usuario.objects.filter(cedula=request.data["username"]).exists():
            user["cedula"] = models.Usuario.objects.get(
                cedula=request.data["username"]
            ).cedula
            user["password"] = request.data["password"]

        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data, status=200)
"""
