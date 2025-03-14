from .models import *
from rest_framework import serializers


class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesor
        fields = [
            "fk_usuario",
        ]


class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = [
            "fk_usuario",
        ]


class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = [
            "catedra",
            "fk_profesor",
        ]


class PreguntaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pregunta
        fields = [
            "pregunta",
            "nivel",
            "fk_materia",
        ]


class RespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Respuesta
        fields = [
            "respuesta",
            "condicion",
            "fk_pregunta",
        ]


class EvaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluacion
        fields = [
            "f_visto",
            "tipo",
            "fk_pregunta",
            "fk_respuesta",
        ]


class ContenidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contenido
        fields = [
            "tema",
            "pauta",
            "average",
            "fk_materia",
        ]


class SeccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seccion
        fields = [
            "nombre",
            "cantidad",
        ]


class ClaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clase
        fields = [
            "f_visto",
            "fk_contenido",
            "fk_evaluacion",
        ]


class SalonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salon
        fields = [
            "activo",
            "average",
            "fk_seccion",
            "fk_estudiante",
            "fk_profesor",
            "fk_clase",
        ]


class NotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nota
        fields = [
            "puntos",
            "fk_clase",
            "fk_estudiante",
        ]

