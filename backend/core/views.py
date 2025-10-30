from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.db import connection
from django.utils import timezone
from datetime import timedelta
import secrets
from .models import User, Team, Course, Resource, Assignment, ProgressEvent, Notification, Approval, PasswordResetToken
from .serializers import (
    UserSerializer, TeamSerializer, CourseSerializer, ResourceSerializer,
    AssignmentSerializer, ProgressEventSerializer, NotificationSerializer, ApprovalSerializer
)
from .jwt_utils import create_access_token, create_refresh_token, decode_refresh_token, blacklist_refresh_token
from .permissions import IsAdmin, IsManagerOrAdmin


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
    role = request.data.get('role', 'EMPLOYEE')
    
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
    
    valid_roles = [choice[0] for choice in User.ROLE_CHOICES]
    if role not in valid_roles:
        role = 'EMPLOYEE'
    
    try:
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=role
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
    
    if not user:
        return Response(
            {'message': 'If the email exists, a password reset link has been sent'},
            status=status.HTTP_200_OK
        )
    
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
    
    reset_link = f"/reset-password?token={token}"
    
    return Response({
        'message': 'If the email exists, a password reset link has been sent',
        'resetLink': reset_link,
        'token': token
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


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsManagerOrAdmin]


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsManagerOrAdmin]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer


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
