# courses/views.py
from rest_framework.views import APIView
from rest_framework import viewsets, permissions, status, generics, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from .models import Course, Quiz, Question, Gamification, QuizSubmission
from .serializers import (
    CourseSerializer,
    QuizSerializer,
    QuestionSerializer,
    GamificationSerializer,
    QuizSubmissionSerializer,
    QuizDetailSerializer,
    QuizWithQuestionsSerializer
)
from django.contrib.auth import get_user_model

User = get_user_model()

from rest_framework.views import APIView
from rest_framework import viewsets, permissions, status, generics, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from django.db import transaction, models
from django.utils import timezone
from datetime import timedelta
from .models import (
    Course, 
    Quiz, 
    Question, 
    Gamification, 
    QuizSubmission,
    InstructionalObjective,
    CourseMaterial
)
from .serializers import (
    CourseSerializer,
    QuizSerializer,
    QuestionSerializer,
    GamificationSerializer,
    QuizSubmissionSerializer,
    QuizDetailSerializer,
    QuizWithQuestionsSerializer,
    CourseDetailSerializer,
    InstructionalObjectiveSerializer,
    CourseMaterialSerializer
)
from django.contrib.auth import get_user_model

User = get_user_model()

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        if self.request.user.role != 'teacher':
            raise PermissionDenied("Solo los profesores pueden crear cursos")
        
        current_year = timezone.now().year
        serializer.save(
            teacher=self.request.user,
            year=current_year
        )

class PeriodListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        periods = [
            {'value': 'I', 'label': 'Periodo I'},
            {'value': 'II', 'label': 'Periodo II'}
        ]
        return Response(periods)

class CompleteCourseCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        if request.user.role != 'teacher':
            raise PermissionDenied("Solo profesores pueden crear cursos")

        data = request.data
        current_year = timezone.now().year

        # Validar y crear el curso
        course_serializer = CourseSerializer(data={
            'title': data.get('title'),
            'description': data.get('description'),
            'period': data.get('period'),
            'year': current_year,
            'teacher': request.user.id
        })
        
        if not course_serializer.is_valid():
            return Response(
                course_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        course = course_serializer.save()

        # Crear objetivos instruccionales
        objectives = data.get('objectives', [])
        for index, obj in enumerate(objectives):
            InstructionalObjective.objects.create(
                course=course,
                description=obj.get('description'),
                order=obj.get('order', index)
            )

        # Nota: Los materiales y evaluaciones se añadirán después mediante APIs separadas

        return Response(
            CourseDetailSerializer(course).data,
            status=status.HTTP_201_CREATED
        )

class InstructionalObjectiveViewSet(viewsets.ModelViewSet):
    serializer_class = InstructionalObjectiveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs.get('course_pk')
        return InstructionalObjective.objects.filter(
            course_id=course_id,
            course__teacher=self.request.user
        ).order_by('order')

    def perform_create(self, serializer):
        course = Course.objects.get(pk=self.kwargs['course_pk'])
        if course.teacher != self.request.user:
            raise PermissionDenied("No puedes añadir objetivos a este curso.")
        
        # Establecer el orden como último
        last_order = InstructionalObjective.objects.filter(course=course).aggregate(
            models.Max('order')
        )['order__max'] or 0
        serializer.save(course=course, order=last_order + 1)

class CourseMaterialViewSet(viewsets.ModelViewSet):
    serializer_class = CourseMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs.get('course_pk')
        return CourseMaterial.objects.filter(
            course_id=course_id,
            course__teacher=self.request.user
        ).order_by('-created_at')

    def perform_create(self, serializer):
        course = Course.objects.get(pk=self.kwargs['course_pk'])
        if course.teacher != self.request.user:
            raise PermissionDenied("No puedes añadir materiales a este curso.")
        serializer.save(course=course)

    def create(self, request, *args, **kwargs):
        # Manejar la subida de archivos
        file = request.FILES.get('file')
        if not file and not request.data.get('url'):
            raise ValidationError("Debe proporcionar un archivo o una URL")
        
        return super().create(request, *args, **kwargs)

class QuizViewSet(viewsets.ModelViewSet):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Profesores ven sus quizzes, estudiantes ven quizzes publicados
        if self.request.user.role == 'teacher':
            return Quiz.objects.filter(course__teacher=self.request.user)
        return Quiz.objects.filter(
            course__students=self.request.user,
            is_published=True
        ).distinct()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return QuizDetailSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        course = serializer.validated_data['course']
        if course.teacher != self.request.user:
            raise PermissionDenied("No eres el profesor de este curso.")
        serializer.save()

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        quiz = self.get_object()
        if quiz.course.teacher != request.user:
            raise PermissionDenied("Solo el profesor puede publicar el quiz.")
        
        quiz.is_published = True
        quiz.save()
        return Response({'status': 'quiz publicado'})

    @action(detail=True, methods=['get'])
    def questions(self, request, pk=None):
        quiz = self.get_object()
        if request.user.role == 'student' and not quiz.is_published:
            raise PermissionDenied("Este quiz no está publicado.")
        
        questions = quiz.questions.all().order_by('order')
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        quiz_id = self.kwargs.get('quiz_pk')
        return Question.objects.filter(
            quiz_id=quiz_id,
            quiz__course__teacher=self.request.user
        ).order_by('order')

    def perform_create(self, serializer):
        quiz = Quiz.objects.get(pk=self.kwargs['quiz_pk'])
        if quiz.course.teacher != self.request.user:
            raise PermissionDenied("No puedes añadir preguntas a este quiz.")
        
        # Establecer el orden como último
        last_order = Question.objects.filter(quiz=quiz).aggregate(
            models.Max('order')
        )['order__max'] or 0
        serializer.save(quiz=quiz, order=last_order + 1)


class GamificationViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = GamificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Gamification.objects.filter(
            quiz__course__teacher=self.request.user
        )

    def get_object(self):
        quiz_id = self.kwargs['quiz_pk']
        return Gamification.objects.get(quiz_id=quiz_id)

    def perform_update(self, serializer):
        quiz = serializer.instance.quiz
        if quiz.course.teacher != self.request.user:
            raise PermissionDenied("No puedes modificar la gamificación de este quiz.")
        serializer.save()


class QuizSubmissionViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = QuizSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'teacher':
            return QuizSubmission.objects.filter(
                quiz__course__teacher=self.request.user
            )
        return QuizSubmission.objects.filter(student=self.request.user)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        quiz_id = request.data.get('quiz')
        answers = request.data.get('answers', [])
        start_time = request.data.get('start_time')
        
        try:
            quiz = Quiz.objects.get(pk=quiz_id)
            gamification = quiz.gamification
            
            # Validaciones
            if request.user.role != 'student':
                raise PermissionDenied("Solo estudiantes pueden enviar quizzes.")
            
            if not quiz.is_published:
                raise PermissionDenied("Este quiz no está disponible.")
            
            if QuizSubmission.objects.filter(quiz=quiz, student=request.user).exists():
                raise ValidationError("Ya has completado este quiz.")

            # Calcular tiempo tomado
            time_taken = None
            if start_time:
                start_time = timezone.datetime.fromisoformat(start_time)
                time_taken = timezone.now() - start_time
                
                if gamification.time_limit_minutes:
                    time_limit = timedelta(minutes=gamification.time_limit_minutes)
                    if time_taken > time_limit:
                        raise ValidationError("Has excedido el límite de tiempo.")

            # Calcular puntaje
            questions = quiz.questions.all()
            total_questions = questions.count()
            correct_answers = 0
            
            for answer in answers:
                question = questions.get(id=answer['question_id'])
                if answer['answer'] == question.correct_answer:
                    correct_answers += 1
            
            score = (correct_answers / total_questions) * 100
            is_passed = score >= quiz.passing_score
            
            # Gamificación
            xp_earned = 0
            new_badges = []
            
            if is_passed:
                xp_earned = gamification.xp_reward
                if gamification.badge_name:
                    if not request.user.badges.filter(name=gamification.badge_name).exists():
                        new_badges.append(gamification.badge_name)
                        request.user.badges.create(
                            name=gamification.badge_name,
                            quiz=quiz
                        )
                
                # Actualizar XP del usuario
                request.user.xp += xp_earned
                request.user.save()

            # Crear submission
            submission = QuizSubmission.objects.create(
                quiz=quiz,
                student=request.user,
                answers=answers,
                score=score,
                is_passed=is_passed,
                xp_earned=xp_earned,
                new_badges=new_badges,
                time_taken=time_taken
            )

            serializer = self.get_serializer(submission)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class StudentQuizListView(generics.ListAPIView):
    serializer_class = QuizWithQuestionsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'student':
            raise PermissionDenied("Solo estudiantes pueden ver esta lista.")
        
        return Quiz.objects.filter(
            course__students=self.request.user,
            is_published=True
        ).prefetch_related('questions').distinct()


class StudentCoursesList(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # Verificar que el usuario es un estudiante
        if user.role != 'student':
            raise PermissionDenied(
                detail="Solo los estudiantes pueden acceder a esta vista",
                code=status.HTTP_403_FORBIDDEN
            )
        
        # Obtener cursos donde el usuario es estudiante
        return Course.objects.filter(students__id=user.id).select_related('teacher')
    
    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except PermissionDenied as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_403_FORBIDDEN
            )
        except Exception as e:
            return Response(
                {"detail": "Error al obtener los cursos"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeacherCoursesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'teacher':
            return Response(
                {"detail": "Acceso no autorizado"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        courses = Course.objects.filter(teacher=request.user)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)


#---------------------------------courses

class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        course = super().get_object()
        if course.teacher != self.request.user and not course.students.filter(id=self.request.user.id).exists():
            raise PermissionDenied("No tienes acceso a este curso.")
        return course
