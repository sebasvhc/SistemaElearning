# Generated by Django 5.0.8 on 2024-12-01 17:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Materia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('catedra', models.CharField(max_length=40)),
            ],
        ),
        migrations.CreateModel(
            name='Contenido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tema', models.CharField(max_length=40)),
                ('pauta', models.TextField()),
                ('average', models.IntegerField()),
                ('fk_materia', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.materia')),
            ],
        ),
        migrations.CreateModel(
            name='Pregunta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pregunta', models.TextField()),
                ('nivel', models.CharField(choices=[('F', 'Facil'), ('M', 'Medio'), ('D', 'Dificil')], default='Medio', max_length=2)),
                ('fk_contenido', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.contenido')),
            ],
        ),
        migrations.CreateModel(
            name='Evaluacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('FVisto', models.DateField(auto_now_add=True)),
                ('tipo', models.CharField(choices=[('T1', 'Une palabras'), ('T2', 'Escritura'), ('T3', 'Correcion')], default='Escritura', max_length=3)),
                ('fk_pregunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.pregunta')),
            ],
        ),
        migrations.CreateModel(
            name='Profesor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fk_materia', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.materia')),
                ('fk_persona', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.usuario')),
            ],
        ),
        migrations.CreateModel(
            name='Clases',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('FVisto', models.DateField(auto_now_add=True)),
                ('fk_contenido', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.contenido')),
                ('fk_evaluacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.evaluacion')),
                ('fk_materia', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.materia')),
                ('fk_profesor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.profesor')),
            ],
        ),
        migrations.CreateModel(
            name='Respuesta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Respuesta', models.TextField()),
                ('condicion', models.BooleanField(default=True)),
                ('fk_pregunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.pregunta')),
            ],
        ),
        migrations.AddField(
            model_name='evaluacion',
            name='fk_respuesta',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.respuesta'),
        ),
        migrations.CreateModel(
            name='Salon',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('seccion', models.IntegerField()),
                ('activo', models.BooleanField(default=True)),
                ('average', models.IntegerField()),
                ('fk_clase', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.usuario')),
                ('fk_estudiante', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.clases')),
            ],
        ),
    ]
