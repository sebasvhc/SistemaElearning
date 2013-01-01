# courses/models.py
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

User = settings.AUTH_USER_MODEL

class Course(models.Model):
    PERIOD_CHOICES = (
        ('I', 'Periodo I'),
        ('II', 'Periodo II'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    teacher = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='courses_taught'
    )
    students = models.ManyToManyField(
        User,
        related_name='courses_enrolled',
        blank=True
    )
    period = models.CharField(
        max_length=2,
        choices=PERIOD_CHOICES,
        default='I'
    )
    year = models.PositiveIntegerField(
        default=timezone.now().year
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']


class InstructionalObjective(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='objectives'
    )
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']


class CourseMaterial(models.Model):
    MATERIAL_TYPES = (
        ('DOC', 'Documento'),
        ('VID', 'Video'),
        ('LNK', 'Enlace'),
        ('PPT', 'Presentación'),
    )
    
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='materials'
    )
    title = models.CharField(max_length=200)
    material_type = models.CharField(
        max_length=3,
        choices=MATERIAL_TYPES,
        default='DOC'
    )
    file = models.FileField(
        upload_to='course_materials/',
        null=True,
        blank=True
    )
    url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Quiz(models.Model):
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name='quizzes'
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    passing_score = models.IntegerField(
        default=70,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'quizzes'

    def __str__(self):
        return f"{self.title} ({self.course.title})"


class Question(models.Model):
    QUESTION_TYPES = (
        ('MC', 'Multiple Choice'),
        ('TF', 'True/False'),
        ('SA', 'Short Answer'),
    )
    
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    text = models.TextField()
    question_type = models.CharField(
        max_length=2,
        choices=QUESTION_TYPES,
        default='MC'
    )
    options = models.JSONField(
        default=list,
        blank=True,
        help_text="Lista de opciones para preguntas de selección múltiple"
    )
    correct_answer = models.TextField(
        help_text="Respuesta correcta (puede ser texto o índice de opción)"
    )
    points = models.PositiveIntegerField(default=1)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.text[:50]}... ({self.get_question_type_display()})"


class Gamification(models.Model):
    quiz = models.OneToOneField(
        Quiz,
        on_delete=models.CASCADE,
        related_name='gamification'
    )
    points_per_question = models.PositiveIntegerField(default=10)
    badge_name = models.CharField(max_length=100, blank=True)
    badge_image = models.ImageField(
        upload_to='badges/',
        blank=True,
        null=True
    )
    xp_reward = models.PositiveIntegerField(default=100)
    time_limit_minutes = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Límite de tiempo en minutos (opcional)"
    )

    def __str__(self):
        return f"Gamificación para {self.quiz.title}"


class QuizSubmission(models.Model):
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='quiz_submissions'
    )
    answers = models.JSONField()
    score = models.FloatField()
    is_passed = models.BooleanField()
    xp_earned = models.PositiveIntegerField(default=0)
    new_badges = models.JSONField(default=list)
    submitted_at = models.DateTimeField(auto_now_add=True)
    time_taken = models.DurationField(null=True, blank=True)

    class Meta:
        unique_together = ['quiz', 'student']
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.student.username} - {self.quiz.title} ({self.score}%)"