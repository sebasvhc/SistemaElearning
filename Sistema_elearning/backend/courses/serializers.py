# courses/serializers.py
from rest_framework import serializers
from .models import (
    Course, 
    Quiz, 
    Question, 
    Gamification,
    QuizSubmission
)
from django.contrib.auth import get_user_model

User = get_user_model()

class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(
        source='teacher.get_full_name', 
        read_only=True
    )
    student_count = serializers.IntegerField(
        source='students.count',
        read_only=True
    )

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'teacher', 'teacher_name',
            'student_count', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'teacher': {'read_only': True}
        }


class QuizSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(
        source='course.title',
        read_only=True
    )
    question_count = serializers.IntegerField(
        source='questions.count',
        read_only=True
    )

    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description', 'course', 'course_title',
            'is_published', 'passing_score', 'question_count',
            'created_at', 'updated_at'
        ]


class QuizDetailSerializer(QuizSerializer):
    gamification = serializers.SerializerMethodField()

    class Meta(QuizSerializer.Meta):
        fields = QuizSerializer.Meta.fields + ['gamification']

    def get_gamification(self, obj):
        try:
            return GamificationSerializer(obj.gamification).data
        except Quiz.gamification.RelatedObjectDoesNotExist:
            return None


class QuizWithQuestionsSerializer(QuizSerializer):
    questions = serializers.SerializerMethodField()

    class Meta(QuizSerializer.Meta):
        fields = QuizSerializer.Meta.fields + ['questions']

    def get_questions(self, obj):
        return QuestionSerializer(
            obj.questions.all().order_by('order'),
            many=True
        ).data


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'id', 'text', 'question_type', 'options',
            'points', 'order', 'quiz'
        ]
        extra_kwargs = {
            'correct_answer': {'write_only': True},
            'quiz': {'read_only': True}
        }


class GamificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gamification
        fields = [
            'id', 'points_per_question', 'badge_name',
            'badge_image', 'xp_reward', 'time_limit_minutes'
        ]
        extra_kwargs = {
            'quiz': {'read_only': True}
        }


class QuizSubmissionSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(
        source='quiz.title',
        read_only=True
    )
    course_title = serializers.CharField(
        source='quiz.course.title',
        read_only=True
    )

    class Meta:
        model = QuizSubmission
        fields = [
            'id', 'quiz', 'quiz_title', 'course_title',
            'score', 'is_passed', 'xp_earned', 'new_badges',
            'submitted_at', 'time_taken'
        ]
        extra_kwargs = {
            'student': {'read_only': True},
            'answers': {'write_only': True}
        }


class QuizResultSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()
    feedback = serializers.SerializerMethodField()

    class Meta:
        model = QuizSubmission
        fields = [
            'id', 'quiz', 'score', 'is_passed',
            'xp_earned', 'new_badges', 'questions', 'feedback'
        ]

    def get_questions(self, obj):
        questions = []
        for answer in obj.answers:
            question = Question.objects.get(id=answer['question_id'])
            questions.append({
                'text': question.text,
                'options': question.options,
                'correct_answer': question.correct_answer,
                'user_answer': answer['answer'],
                'is_correct': answer['answer'] == question.correct_answer
            })
        return questions

    def get_feedback(self, obj):
        if obj.is_passed:
            return "¡Felicidades! Has aprobado el quiz."
        return f"Necesitas al menos {obj.quiz.passing_score}% para aprobar. Sigue practicando."