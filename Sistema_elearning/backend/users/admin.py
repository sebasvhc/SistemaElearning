from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'cedula', 'role', 'is_verified')
    list_filter = ('role', 'is_verified')
    actions = ['verify_teachers']

    def verify_teachers(self, request, queryset):
        queryset.filter(role='teacher').update(is_verified=True)
    verify_teachers.short_description = "Verificar profesores seleccionados"