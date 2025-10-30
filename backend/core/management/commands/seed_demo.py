from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import User, Team, Course, Assignment
from datetime import timedelta


class Command(BaseCommand):
    help = 'Seed database with demo data matching frontend mock data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database with demo data...')
        
        admin_team = Team.objects.create(
            name='Admin Team',
            description='Platform administrators'
        )
        
        engineering_team = Team.objects.create(
            name='Engineering',
            description='Engineering team'
        )
        
        sales_team = Team.objects.create(
            name='Sales',
            description='Sales team'
        )
        
        admin_user = User.objects.create_user(
            email='admin@company.com',
            password='admin123',
            first_name='Admin',
            last_name='User',
            role='ADMIN',
            team=admin_team
        )
        admin_user.is_staff = True
        admin_user.save()
        self.stdout.write(self.style.SUCCESS(f'Created admin: {admin_user.email}'))
        
        manager_user = User.objects.create_user(
            email='manager@company.com',
            password='manager123',
            first_name='Sarah',
            last_name='Johnson',
            role='MANAGER',
            team=engineering_team
        )
        self.stdout.write(self.style.SUCCESS(f'Created manager: {manager_user.email}'))
        
        engineering_team.manager = manager_user
        engineering_team.save()
        
        employee_user = User.objects.create_user(
            email='employee@company.com',
            password='employee123',
            first_name='John',
            last_name='Doe',
            role='EMPLOYEE',
            team=engineering_team
        )
        self.stdout.write(self.style.SUCCESS(f'Created employee: {employee_user.email}'))
        
        employee2 = User.objects.create_user(
            email='jane.smith@company.com',
            password='password123',
            first_name='Jane',
            last_name='Smith',
            role='EMPLOYEE',
            team=engineering_team
        )
        
        employee3 = User.objects.create_user(
            email='mike.wilson@company.com',
            password='password123',
            first_name='Mike',
            last_name='Wilson',
            role='EMPLOYEE',
            team=sales_team
        )
        
        courses_data = [
            {
                'title': 'React Fundamentals',
                'description': 'Learn the fundamentals of React including components, props, state, and hooks.',
                'video_url': 'https://www.youtube.com/embed/Ke90Tje7VS0',
                'thumbnail_url': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
                'status': 'published',
                'level': 'beginner',
                'duration': '4 hours',
            },
            {
                'title': 'Advanced TypeScript',
                'description': 'Deep dive into advanced TypeScript features including generics, decorators, and type manipulation.',
                'video_url': 'https://www.youtube.com/embed/Jp56CCzz0-Y',
                'thumbnail_url': 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
                'status': 'published',
                'level': 'advanced',
                'duration': '6 hours',
            },
            {
                'title': 'Python for Data Science',
                'description': 'Introduction to data science using Python, NumPy, Pandas, and Matplotlib.',
                'video_url': 'https://www.youtube.com/embed/LHBE6Q9XlzI',
                'thumbnail_url': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
                'status': 'published',
                'level': 'intermediate',
                'duration': '8 hours',
            },
            {
                'title': 'Docker & Kubernetes Basics',
                'description': 'Learn containerization with Docker and orchestration with Kubernetes.',
                'video_url': 'https://www.youtube.com/embed/3c-iBn73dDE',
                'thumbnail_url': 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400',
                'status': 'draft',
                'level': 'intermediate',
                'duration': '5 hours',
            },
            {
                'title': 'Machine Learning 101',
                'description': 'Introduction to machine learning concepts and algorithms.',
                'video_url': 'https://www.youtube.com/embed/ukzFI9rgwfU',
                'thumbnail_url': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
                'status': 'awaiting_approval',
                'level': 'intermediate',
                'duration': '10 hours',
            },
            {
                'title': 'UI/UX Design Principles',
                'description': 'Master the fundamentals of user interface and user experience design.',
                'video_url': 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
                'thumbnail_url': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
                'status': 'published',
                'level': 'beginner',
                'duration': '4 hours',
            },
        ]
        
        courses = []
        for course_data in courses_data:
            course = Course.objects.create(
                created_by=manager_user,
                **course_data
            )
            courses.append(course)
            self.stdout.write(self.style.SUCCESS(f'Created course: {course.title}'))
        
        Assignment.objects.create(
            user=employee_user,
            course=courses[0],
            assigned_by=manager_user,
            status='in_progress',
            progress_pct=65,
            last_activity_at=timezone.now()
        )
        
        Assignment.objects.create(
            user=employee_user,
            course=courses[1],
            assigned_by=manager_user,
            status='not_started',
            progress_pct=0
        )
        
        Assignment.objects.create(
            user=employee_user,
            course=courses[2],
            assigned_by=manager_user,
            status='completed',
            progress_pct=100,
            completed_at=timezone.now() - timedelta(days=5)
        )
        
        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
        self.stdout.write(self.style.WARNING('\nLogin credentials:'))
        self.stdout.write('Admin: admin@company.com / admin123')
        self.stdout.write('Manager: manager@company.com / manager123')
        self.stdout.write('Employee: employee@company.com / employee123')
