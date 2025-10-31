from rest_framework import serializers
from .models import User, Team, Course, Resource, Assignment, ProgressEvent, Notification, Approval


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'role', 'team', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class EmployeeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    designation = serializers.CharField(source='job_title', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'designation']
        read_only_fields = ['id', 'name', 'email', 'designation']
    
    def get_name(self, obj):
        return obj.get_full_name()


class TeamSerializer(serializers.ModelSerializer):
    manager_name = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'manager', 'manager_name', 'member_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_manager_name(self, obj):
        return obj.manager.full_name if obj.manager else None
    
    def get_member_count(self, obj):
        return obj.members.count()


class CourseSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'video_url', 'thumbnail_url', 'status', 
                  'level', 'duration', 'created_by', 'created_by_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_created_by_name(self, obj):
        return obj.created_by.full_name if obj.created_by else None


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'course', 'title', 'resource_type', 'viewer_url', 'created_at']
        read_only_fields = ['id', 'created_at']


class AssignmentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    course_title = serializers.SerializerMethodField()
    assigned_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Assignment
        fields = ['id', 'user', 'user_name', 'course', 'course_title', 'assigned_by', 
                  'assigned_by_name', 'status', 'progress_pct', 'last_activity_at', 
                  'assigned_at', 'completed_at']
        read_only_fields = ['id', 'assigned_at']
    
    def get_user_name(self, obj):
        return obj.user.full_name if obj.user else None
    
    def get_course_title(self, obj):
        return obj.course.title if obj.course else None
    
    def get_assigned_by_name(self, obj):
        return obj.assigned_by.full_name if obj.assigned_by else None


class ProgressEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressEvent
        fields = ['id', 'assignment', 'progress_pct', 'created_at']
        read_only_fields = ['id', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'text', 'read_at', 'created_at']
        read_only_fields = ['id', 'created_at']


class ApprovalSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField()
    requested_by_name = serializers.SerializerMethodField()
    approved_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Approval
        fields = ['id', 'course', 'course_title', 'requested_by', 'requested_by_name', 
                  'approved_by', 'approved_by_name', 'status', 'notes', 'rejection_note', 
                  'requested_at', 'reviewed_at']
        read_only_fields = ['id', 'requested_at']
    
    def get_course_title(self, obj):
        return obj.course.title if obj.course else None
    
    def get_requested_by_name(self, obj):
        return obj.requested_by.full_name if obj.requested_by else None
    
    def get_approved_by_name(self, obj):
        return obj.approved_by.full_name if obj.approved_by else None
