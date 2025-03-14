from rest_framework.views import APIView
from rest_framework.response import Response
#from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

from . import models

# Create your views here.

class Login(APIView):
    serializer_class = TokenObtainPairSerializer
    def post(self,request):
        user = {"cedula":"","password":"",}
        if models.Usuario.objects.filter(username=request.data['username']).exists():
            user["cedula"] = models.Usuario.objects.get(username=request.data['username']).cedula
            user["password"] = request.data["password"]

        elif models.Usuario.objects.filter(cedula=request.data['username']).exists():
            user["cedula"] = models.Usuario.objects.get(cedula=request.data['username']).cedula
            user["password"] = request.data["password"]

        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data, status=200)


'''
class Register(APIView):
    def post(self,request):


        # Falta configurar para poder hacer el registro de usuarios


        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            token = RefreshToken(refresh)
            return Response({
                'refresh': str(refresh),
                'access': str(token.access_token),}, status=200)

        else:
            return Response({'error': 'Credenciales inválidas'}, status=401)'''