from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'teams', views.TeamViewSet)
router.register(r'courses', views.CourseViewSet)
router.register(r'resources', views.ResourceViewSet)
router.register(r'assignments', views.AssignmentViewSet)
router.register(r'progress-events', views.ProgressEventViewSet)
router.register(r'notifications', views.NotificationViewSet)
router.register(r'approvals', views.ApprovalViewSet)

urlpatterns = [
    path('auth/login', views.login, name='login'),
    path('auth/register', views.register, name='register'),
    path('auth/refresh', views.refresh, name='refresh'),
    path('auth/logout', views.logout, name='logout'),
    path('auth/password-reset/request', views.request_password_reset, name='request_password_reset'),
    path('auth/password-reset/confirm', views.reset_password, name='reset_password'),
    path('health/db', views.health_db, name='health_db'),
    path('employees/', views.employees_list, name='employees_list'),
    path('', include(router.urls)),
]
