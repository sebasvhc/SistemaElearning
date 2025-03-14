
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
# trabajar vistas mediante clases

class Sala(APIView):
    def get(self,request):
        argumentos={'texto':'<h1><strong>Hola mundo...!!!</strong></h1>'}
        return Response(argumentos)

    def post(self,request):
        argumentos={'texto':'<h1><strong>Hola de nuevo people\'s.!</strong></h1>'}
        return Response(argumentos)
