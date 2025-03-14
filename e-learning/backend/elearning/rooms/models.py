from django.db import models
from usuarios.models import Usuario as user


# Create your models here.
class Profesor(models.Model):
    fk_usuario = models.ForeignKey(user, on_delete=models.CASCADE)


class Estudiante(models.Model):
    fk_usuario = models.ForeignKey(user, on_delete=models.CASCADE)


class Materia(models.Model):
    catedra = models.CharField(max_length=40)
    fk_profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)


class Pregunta(models.Model):
    NIVEL = {
        "F": "Facil",
        "M": "Medio",
        "D": "Dificil",
    }

    pregunta = models.TextField()
    nivel = models.CharField(max_length=2, choices=NIVEL, default=NIVEL["M"])
    fk_materia = models.ForeignKey(Materia, on_delete=models.CASCADE)


class Respuesta(models.Model):
    respuesta = models.TextField()
    condicion = models.BooleanField(default=True)
    fk_pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE)


class Evaluacion(models.Model):
    TIPO_EVALUACION = {
        "T1": "Une palabras",
        "T2": "Escritura",
        "T3": "Correcion",
    }

    f_visto = models.DateField(auto_now_add=True)
    tipo = models.CharField(
        max_length=3, choices=TIPO_EVALUACION, default=TIPO_EVALUACION["T2"]
    )
    fk_pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE)
    fk_respuesta = models.ForeignKey(Respuesta, on_delete=models.CASCADE)


class Contenido(models.Model):
    tema = models.CharField(max_length=40)
    pauta = models.TextField()
    average = models.IntegerField()
    fk_materia = models.ForeignKey(Materia, on_delete=models.CASCADE)


class Seccion(models.Model):
    nombre = models.CharField(max_length=10)
    cantidad = models.IntegerField()


class Clase(models.Model):
    f_visto = models.DateField(auto_now_add=True)
    fk_contenido = models.ForeignKey(Contenido, on_delete=models.CASCADE)
    fk_evaluacion = models.ForeignKey(Evaluacion, on_delete=models.CASCADE)


class Salon(models.Model):
    activo = models.BooleanField(default=True)
    average = models.IntegerField()
    fk_seccion = models.ForeignKey(Seccion, on_delete=models.CASCADE)
    fk_estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE)
    fk_profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)
    fk_clase = models.ForeignKey(Clase, on_delete=models.CASCADE)


class Nota(models.Model):
    puntos = models.IntegerField()
    fk_clase = models.ForeignKey(Clase, on_delete=models.CASCADE)
    fk_estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE)

