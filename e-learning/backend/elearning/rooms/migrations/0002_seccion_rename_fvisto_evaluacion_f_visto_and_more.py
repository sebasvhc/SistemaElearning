# Generated by Django 5.0.8 on 2024-12-03 20:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0001_initial'),
        ('usuarios', '0002_rename_fnacimiento_usuario_f_nacimiento_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Seccion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=10)),
                ('cantidad', models.IntegerField()),
            ],
        ),
        migrations.RenameField(
            model_name='evaluacion',
            old_name='FVisto',
            new_name='f_visto',
        ),
        migrations.RenameField(
            model_name='profesor',
            old_name='fk_persona',
            new_name='fk_usuario',
        ),
        migrations.RemoveField(
            model_name='pregunta',
            name='fk_contenido',
        ),
        migrations.RemoveField(
            model_name='profesor',
            name='fk_materia',
        ),
        migrations.RemoveField(
            model_name='salon',
            name='seccion',
        ),
        migrations.AddField(
            model_name='materia',
            name='fk_profesor',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='rooms.profesor'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pregunta',
            name='fk_materia',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='rooms.materia'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='salon',
            name='fk_profesor',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='rooms.profesor'),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Clase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('f_visto', models.DateField(auto_now_add=True)),
                ('fk_contenido', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.contenido')),
                ('fk_evaluacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.evaluacion')),
            ],
        ),
        migrations.AlterField(
            model_name='salon',
            name='fk_clase',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.clase'),
        ),
        migrations.CreateModel(
            name='Estudiante',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fk_usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.usuario')),
            ],
        ),
        migrations.AlterField(
            model_name='salon',
            name='fk_estudiante',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.estudiante'),
        ),
        migrations.CreateModel(
            name='Nota',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('puntos', models.IntegerField()),
                ('fk_clase', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.clase')),
                ('fk_estudiante', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rooms.estudiante')),
            ],
        ),
        migrations.AddField(
            model_name='salon',
            name='fk_seccion',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='rooms.seccion'),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='Clases',
        ),
    ]
