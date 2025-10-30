from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Team, Course, Resource, Assignment, ProgressEvent, Notification, Approval, RefreshToken


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'team', 'is_staff', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'role', 'team')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'role', 'team'),
        }),
    )


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'manager', 'created_at')
    search_fields = ('name',)
    list_filter = ('created_at',)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'level', 'created_by', 'created_at')
    list_filter = ('status', 'level', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('-created_at',)


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'resource_type', 'created_at')
    list_filter = ('resource_type', 'created_at')
    search_fields = ('title',)


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'status', 'progress_pct', 'assigned_by', 'assigned_at')
    list_filter = ('status', 'assigned_at')
    search_fields = ('user__email', 'course__title')


@admin.register(ProgressEvent)
class ProgressEventAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'progress_pct', 'created_at')
    list_filter = ('created_at',)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'text', 'read_at', 'created_at')
    list_filter = ('read_at', 'created_at')
    search_fields = ('user__email', 'text')


@admin.register(Approval)
class ApprovalAdmin(admin.ModelAdmin):
    list_display = ('course', 'requested_by', 'approved_by', 'status', 'requested_at')
    list_filter = ('status', 'requested_at')
    search_fields = ('course__title',)


@admin.register(RefreshToken)
class RefreshTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'expires_at', 'is_blacklisted')
    list_filter = ('is_blacklisted', 'created_at')
    search_fields = ('user__email',)
