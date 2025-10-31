from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.db import connection, models
from django.utils import timezone
from datetime import timedelta
import secrets
from .models import User, Team, Course, Resource, Assignment, ProgressEvent, Notification, Approval, PasswordResetToken
from .serializers import (
    UserSerializer, TeamSerializer, CourseSerializer, ResourceSerializer,
    AssignmentSerializer, ProgressEventSerializer, NotificationSerializer, ApprovalSerializer,
    EmployeeSerializer
)
from .jwt_utils import create_access_token, create_refresh_token, decode_refresh_token, blacklist_refresh_token
from .permissions import IsAdmin, IsManagerOrAdmin, IsAuthenticated


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects.filter(email=email).first()
    
    if user and user.check_password(password):
        if not user.is_active:
            return Response(
                {'error': 'Account is disabled'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        access_token = create_access_token(user)
        refresh_token = create_refresh_token(user)
        
        return Response({
            'access': access_token,
            'refresh': refresh_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'role': user.role,
            }
        })
    
    return Response(
        {'error': 'Invalid email or password'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh(request):
    refresh_token = request.data.get('refresh')
    
    if not refresh_token:
        return Response(
            {'error': 'Refresh token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    payload = decode_refresh_token(refresh_token)
    
    if not payload:
        return Response(
            {'error': 'Invalid or expired refresh token'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    user = User.objects.filter(id=payload['user_id']).first()
    
    if not user or not user.is_active:
        return Response(
            {'error': 'User not found or inactive'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    access_token = create_access_token(user)
    
    return Response({
        'access': access_token
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    refresh_token = request.data.get('refresh')
    
    if refresh_token:
        blacklist_refresh_token(refresh_token)
    
    return Response({'message': 'Logged out successfully'})


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('firstName', '')
    last_name = request.data.get('lastName', '')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(password) < 8:
        return Response(
            {'error': 'Password must be at least 8 characters long'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'User with this email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role='EMPLOYEE'
        )
        
        access_token = create_access_token(user)
        refresh_token = create_refresh_token(user)
        
        return Response({
            'access': access_token,
            'refresh': refresh_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'role': user.role,
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response(
            {'error': f'Failed to create user: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'error': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects.filter(email=email).first()
    
    if user:
        PasswordResetToken.objects.filter(
            user=user,
            is_used=False,
            expires_at__gt=timezone.now()
        ).update(is_used=True)
        
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=1)
        
        PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
    
    return Response({
        'message': 'If the email exists, a password reset link has been sent'
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    token = request.data.get('token')
    new_password = request.data.get('password')
    
    if not token or not new_password:
        return Response(
            {'error': 'Token and new password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(new_password) < 8:
        return Response(
            {'error': 'Password must be at least 8 characters long'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    reset_token = PasswordResetToken.objects.filter(
        token=token,
        is_used=False,
        expires_at__gt=timezone.now()
    ).first()
    
    if not reset_token:
        return Response(
            {'error': 'Invalid or expired reset token'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = reset_token.user
    user.set_password(new_password)
    user.save()
    
    reset_token.is_used = True
    reset_token.save()
    
    return Response({
        'message': 'Password has been reset successfully'
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def health_db(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
        
        return Response({
            'status': 'healthy',
            'database': 'connected',
            'result': result[0] if result else None
        })
    except Exception as e:
        return Response({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e)
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(['GET'])
@permission_classes([IsManagerOrAdmin])
def employees_list(request):
    """
    List all employees with optional search.
    Only accessible by MANAGER and ADMIN roles.
    Query params:
    - q: search by name or email
    """
    queryset = User.objects.all().order_by('first_name', 'last_name', 'email')
    
    search_query = request.query_params.get('q', '').strip()
    if search_query:
        from django.db.models import Q
        queryset = queryset.filter(
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query)
        )
    
    serializer = EmployeeSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAdmin])
def employee_update(request, user_id):
    """
    Update employee details including role.
    Only accessible by ADMIN role.
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    first_name = request.data.get('firstName')
    last_name = request.data.get('lastName')
    job_title = request.data.get('jobTitle')
    role = request.data.get('role')
    
    if first_name is not None:
        first_name = first_name.strip()
        if not first_name:
            return Response(
                {'error': 'First name cannot be empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.first_name = first_name
        
    if last_name is not None:
        last_name = last_name.strip()
        if not last_name:
            return Response(
                {'error': 'Last name cannot be empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.last_name = last_name
        
    if job_title is not None:
        user.job_title = job_title.strip()
        
    if role is not None:
        VALID_ROLES = ['ADMIN', 'MANAGER', 'TL', 'SRMGR', 'EMPLOYEE']
        if role not in VALID_ROLES:
            return Response(
                {'error': f'Invalid role. Must be one of: {", ".join(VALID_ROLES)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.role = role
    
    user.save()
    
    serializer = EmployeeSerializer(user)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdmin])
def employee_delete(request, user_id):
    """
    Delete an employee.
    Only accessible by ADMIN role.
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if user.id == request.user.id:
        return Response(
            {'error': 'Cannot delete yourself'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.delete()
    return Response({'message': 'User deleted successfully'})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsManagerOrAdmin]
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search employees by name or email (for managers to find team members)"""
        query = request.GET.get('q', '').strip()
        
        users = User.objects.all()
        
        if query:
            users = users.filter(
                models.Q(first_name__icontains=query) |
                models.Q(last_name__icontains=query) |
                models.Q(email__icontains=query)
            )
        
        # Use EmployeeSerializer for the response
        serializer = EmployeeSerializer(users, many=True)
        return Response(serializer.data)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsManagerOrAdmin]
    
    @action(detail=False, methods=['get'])
    def members(self, request):
        """Get the manager's team members"""
        user = request.user
        
        if user.role == 'ADMIN':
            # Admins see all users
            members = User.objects.all()
        elif user.team:
            # Managers see their team members
            members = User.objects.filter(team=user.team)
        else:
            # Manager with no team sees no members
            members = User.objects.none()
        
        serializer = EmployeeSerializer(members, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_member(self, request):
        """Add a user to the manager's team"""
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user_to_add = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get or create team for the manager
        manager = request.user
        team = manager.team
        
        if not team:
            # Create a team for this manager if they don't have one
            team = Team.objects.create(
                name=f"{manager.get_full_name()}'s Team",
                manager=manager
            )
            manager.team = team
            manager.save(update_fields=['team'])
        
        # Add user to team
        user_to_add.team = team
        user_to_add.save(update_fields=['team'])
        
        return Response({
            'message': 'User added to team successfully',
            'user': EmployeeSerializer(user_to_add).data,
            'team': TeamSerializer(team).data
        })


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """
        Admin-only for update/delete operations.
        Create requires authentication (handled in create method).
        List/retrieve open to authenticated users.
        """
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Role-aware course filtering"""
        user = self.request.user
        
        if user.role == 'ADMIN':
            # Admin sees all courses
            return Course.objects.all()
        elif user.role in ['MANAGER', 'TL', 'SRMGR']:
            # Manager sees published courses + their own courses
            return Course.objects.filter(
                models.Q(status='published') | models.Q(created_by=user)
            )
        else:
            # Employee sees only published courses
            return Course.objects.filter(status='published')
    
    def create(self, request, *args, **kwargs):
        """Handle role-based course creation"""
        user = request.user
        data = request.data.copy()
        
        # Set created_by
        data['created_by'] = user.id
        
        # Role-based status logic
        if user.role in ['MANAGER', 'TL', 'SRMGR']:
            # Managers always create courses as awaiting_approval
            data['status'] = 'awaiting_approval'
        elif user.role == 'ADMIN':
            # Admin can set status (default to draft if not provided)
            if 'status' not in data:
                data['status'] = 'draft'
        else:
            # Employees cannot create courses
            return Response(
                {'error': 'You do not have permission to create courses'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        
        # Create approval request for managers
        if user.role in ['MANAGER', 'TL', 'SRMGR']:
            Approval.objects.create(
                course=course,
                requested_by=user,
                status='pending'
            )
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdmin])
    def publish(self, request, pk=None):
        """Publish a course and approve it (Admin only)"""
        course = self.get_object()
        course.status = 'published'
        course.save()
        
        # Update related approval if exists
        approval = Approval.objects.filter(course=course, status='pending').first()
        if approval:
            approval.status = 'approved'
            approval.approved_by = request.user
            approval.reviewed_at = timezone.now()
            approval.save()
        
        serializer = self.get_serializer(course)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdmin])
    def unpublish(self, request, pk=None):
        """Unpublish a course (Admin only)"""
        course = self.get_object()
        course.status = 'draft'
        course.save()
        
        serializer = self.get_serializer(course)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def reject(self, request, pk=None):
        """Reject a course approval request (Admin only)"""
        course = self.get_object()
        note = request.data.get('note', '')
        
        course.status = 'draft'
        course.save()
        
        # Update related approval
        approval = Approval.objects.filter(course=course, status='pending').first()
        if approval:
            approval.status = 'rejected'
            approval.approved_by = request.user
            approval.reviewed_at = timezone.now()
            approval.rejection_note = note
            approval.save()
        
        serializer = self.get_serializer(course)
        return Response(serializer.data)


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter assignments based on user role"""
        user = self.request.user
        
        if user.role == 'ADMIN':
            return Assignment.objects.all()
        elif user.role in ['MANAGER', 'TL', 'SRMGR']:
            # Managers see assignments for their team members
            if user.team:
                return Assignment.objects.filter(
                    models.Q(user__team=user.team) | models.Q(user=user)
                )
            return Assignment.objects.filter(user=user)
        else:
            # Employees see only their own assignments
            return Assignment.objects.filter(user=user)
    
    def create(self, request, *args, **kwargs):
        """Create or update an assignment (upsert)"""
        course_id = request.data.get('course_id')
        user_id = request.data.get('user_id')
        
        if not course_id:
            return Response(
                {'error': 'course_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # If user_id not provided, assign to self (employee starting a course)
        if not user_id:
            user_id = request.user.id
        
        # Check permissions for assigning to others
        if user_id != request.user.id:
            if request.user.role not in ['ADMIN', 'MANAGER', 'TL', 'SRMGR']:
                return Response(
                    {'error': 'You do not have permission to assign courses to others'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        try:
            course = Course.objects.get(id=course_id)
            user = User.objects.get(id=user_id)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Upsert: get or create
        assignment, created = Assignment.objects.get_or_create(
            user=user,
            course=course,
            defaults={
                'assigned_by': request.user,
                'status': 'not_started',
                'progress_pct': 0
            }
        )
        
        if not created:
            # Update assigned_by if reassigning
            assignment.assigned_by = request.user
            assignment.save(update_fields=['assigned_by'])
        
        serializer = self.get_serializer(assignment)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def mine(self, request):
        """Get employee's own assignments with nested course data"""
        assignments = Assignment.objects.filter(user=request.user).select_related('course', 'assigned_by')
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsManagerOrAdmin])
    def team(self, request):
        """Get assignments for manager's team members"""
        user = request.user
        
        if user.role == 'ADMIN':
            assignments = Assignment.objects.all()
        elif user.team:
            assignments = Assignment.objects.filter(user__team=user.team)
        else:
            assignments = Assignment.objects.none()
        
        assignments = assignments.select_related('user', 'course', 'assigned_by')
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def progress(self, request, pk=None):
        """Update assignment progress and create progress event"""
        assignment = self.get_object()
        
        # Check permission: only the assigned user or managers/admins can update
        if assignment.user != request.user and request.user.role not in ['ADMIN', 'MANAGER', 'TL', 'SRMGR']:
            return Response(
                {'error': 'You do not have permission to update this assignment'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        progress_pct = request.data.get('progress_pct')
        new_status = request.data.get('status')
        
        if progress_pct is not None:
            try:
                progress_pct = int(progress_pct)
                if progress_pct < 0 or progress_pct > 100:
                    raise ValueError()
            except (ValueError, TypeError):
                return Response(
                    {'error': 'progress_pct must be an integer between 0 and 100'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            assignment.progress_pct = progress_pct
            assignment.last_activity_at = timezone.now()
            
            # Auto-complete at 100%
            if progress_pct >= 100:
                assignment.status = 'completed'
                if not assignment.completed_at:
                    assignment.completed_at = timezone.now()
            elif progress_pct > 0 and assignment.status == 'not_started':
                assignment.status = 'in_progress'
            
            # Create progress event
            ProgressEvent.objects.create(
                assignment=assignment,
                progress_pct=progress_pct
            )
        
        if new_status and new_status in ['not_started', 'in_progress', 'completed']:
            assignment.status = new_status
            if new_status == 'completed' and not assignment.completed_at:
                assignment.completed_at = timezone.now()
        
        assignment.save()
        
        serializer = self.get_serializer(assignment)
        return Response(serializer.data)


class ProgressEventViewSet(viewsets.ModelViewSet):
    queryset = ProgressEvent.objects.all()
    serializer_class = ProgressEventSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


class ApprovalViewSet(viewsets.ModelViewSet):
    queryset = Approval.objects.all()
    serializer_class = ApprovalSerializer
    permission_classes = [IsManagerOrAdmin]
