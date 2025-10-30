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
    path('auth/refresh', views.refresh, name='refresh'),
    path('auth/logout', views.logout, name='logout'),
    path('health/db', views.health_db, name='health_db'),
    path('', include(router.urls)),
]
