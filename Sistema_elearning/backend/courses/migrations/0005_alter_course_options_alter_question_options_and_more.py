# Generated by Django 5.2.1 on 2025-06-22 03:50

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0004_course_created_at_course_students_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='course',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterModelOptions(
            name='question',
            options={'ordering': ['order']},
        ),
        migrations.AlterModelOptions(
            name='quiz',
            options={'ordering': ['-created_at'], 'verbose_name_plural': 'quizzes'},
        ),
        migrations.AddField(
            model_name='course',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='course',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='question',
            name='order',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='question',
            name='points',
            field=models.PositiveIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='question',
            name='question_type',
            field=models.CharField(choices=[('MC', 'Multiple Choice'), ('TF', 'True/False'), ('SA', 'Short Answer')], default='MC', max_length=2),
        ),
        migrations.AddField(
            model_name='quiz',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='quiz',
            name='passing_score',
            field=models.IntegerField(default=70, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)]),
        ),
        migrations.AddField(
            model_name='quiz',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='correct_answer',
            field=models.TextField(help_text='Respuesta correcta (puede ser texto o índice de opción)'),
        ),
        migrations.AlterField(
            model_name='question',
            name='options',
            field=models.JSONField(blank=True, default=list, help_text='Lista de opciones para preguntas de selección múltiple'),
        ),
        migrations.CreateModel(
            name='Gamification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('points_per_question', models.PositiveIntegerField(default=10)),
                ('badge_name', models.CharField(blank=True, max_length=100)),
                ('badge_image', models.ImageField(blank=True, null=True, upload_to='badges/')),
                ('xp_reward', models.PositiveIntegerField(default=100)),
                ('time_limit_minutes', models.PositiveIntegerField(blank=True, help_text='Límite de tiempo en minutos (opcional)', null=True)),
                ('quiz', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='gamification', to='courses.quiz')),
            ],
        ),
        migrations.CreateModel(
            name='QuizSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answers', models.JSONField()),
                ('score', models.FloatField()),
                ('is_passed', models.BooleanField()),
                ('xp_earned', models.PositiveIntegerField(default=0)),
                ('new_badges', models.JSONField(default=list)),
                ('submitted_at', models.DateTimeField(auto_now_add=True)),
                ('time_taken', models.DurationField(blank=True, null=True)),
                ('quiz', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='submissions', to='courses.quiz')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='quiz_submissions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-submitted_at'],
                'unique_together': {('quiz', 'student')},
            },
        ),
        migrations.DeleteModel(
            name='GamificationRule',
        ),
    ]
