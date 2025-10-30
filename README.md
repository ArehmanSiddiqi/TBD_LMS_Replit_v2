# LMS Platform - Learning Management System

A full-stack Learning Management System with role-based access control, course management, and progress tracking.

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Fast build tool with HMR
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

### Backend
- **Django 5** + **Django REST Framework**
- **PostgreSQL** (Supabase) - Production database
- **JWT Authentication** - Secure token-based auth
- **Python 3.11**

## Project Structure

```
workspace/
├── frontend/           # React TypeScript application
│   ├── src/
│   │   ├── pages/     # Route-level components
│   │   ├── components/ # Reusable UI components
│   │   ├── auth/      # Authentication service
│   │   ├── types/     # TypeScript definitions
│   │   └── mocks/     # Mock data (for reference)
│   └── package.json
│
├── backend/           # Django REST API
│   ├── config/       # Django project settings
│   ├── core/         # Main Django app
│   │   ├── models.py        # Database models
│   │   ├── views.py         # API endpoints
│   │   ├── serializers.py   # DRF serializers
│   │   ├── admin.py         # Admin interface
│   │   ├── jwt_utils.py     # JWT token management
│   │   └── management/      # Custom commands
│   └── requirements.txt
│
└── preflight.sh      # Database validation script
```

## Getting Started

### Prerequisites

The following environment variables are required:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `DJANGO_SECRET_KEY` - Django secret key
- `JWT_ACCESS_SECRET` - JWT access token secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret

### Installation

1. **Hit Run** - Both frontend and backend will start automatically
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:8000

2. **Initial Database Setup** (first time only):
```bash
cd backend
python manage.py migrate
python manage.py seed_demo
```

### Demo Login Credentials

After running `seed_demo`, use these credentials:

- **Admin**: `admin@company.com` / `admin123`
- **Manager**: `manager@company.com` / `manager123`
- **Employee**: `employee@company.com` / `employee123`

## API Documentation

### Base URL
```
http://localhost:8000/api/v1/
```

### Authentication Endpoints

#### POST /auth/login
Login with email and password, returns JWT tokens.

**Request:**
```json
{
  "email": "admin@company.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access": "eyJhbGc...",
  "refresh": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@company.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refresh": "eyJhbGc..."
}
```

**Response:**
```json
{
  "access": "eyJhbGc..."
}
```

#### POST /auth/logout
Invalidate refresh token.

**Request:**
```json
{
  "refresh": "eyJhbGc..."
}
```

### Health Check

#### GET /health/db
Check database connectivity.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "result": 1
}
```

### Resource Endpoints

Standard REST endpoints for all resources:

- **Users**: `/users/`
- **Teams**: `/teams/`
- **Courses**: `/courses/`
- **Resources**: `/resources/`
- **Assignments**: `/assignments/`
- **Progress Events**: `/progress-events/`
- **Notifications**: `/notifications/`
- **Approvals**: `/approvals/`

Each supports standard CRUD operations (GET, POST, PUT, PATCH, DELETE).

## Database Models

### User
- Email-based authentication (email as username)
- Roles: ADMIN, MANAGER, TL, SRMGR, EMPLOYEE
- Optional team assignment
- Password hashing with Django's auth system

### Team
- Team name and description
- Manager assignment (FK to User)
- Member tracking via reverse relationship

### Course
- Title, description, media URLs
- Status: draft, published, needs_revision, awaiting_approval
- Level: beginner, intermediate, advanced
- Created by (FK to User)

### Assignment
- User-Course relationship
- Status: not_started, in_progress, completed
- Progress percentage tracking
- Assigned by (FK to User)

### Other Models
- **Resource**: Course materials (Google Docs, Slides, PDFs)
- **ProgressEvent**: Course progress history
- **Notification**: User notifications
- **Approval**: Course approval workflow
- **RefreshToken**: JWT refresh token management with blacklist

## Development

### Backend Development

```bash
cd backend

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Access Django admin
# Navigate to http://localhost:8000/admin/

# Run tests
python manage.py test

# Django shell
python manage.py shell
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture Notes

### Authentication Flow
1. User submits email/password to `/api/v1/auth/login`
2. Backend validates credentials and returns JWT tokens
3. Frontend stores tokens (currently in localStorage)
4. Access token used for API requests (1 hour lifetime)
5. Refresh token used to get new access tokens (7 day lifetime)
6. Logout blacklists the refresh token

### Database
- Uses Supabase PostgreSQL (managed Postgres)
- Connection pooling enabled (600s max age)
- Automatic migrations on startup
- SQLite explicitly blocked via preflight checks

### CORS Configuration
- Allows all origins in development (for Replit environment)
- Credentials enabled for cookie-based auth (if needed)
- Should be restricted in production

## Management Commands

### seed_demo
Populates database with demo users, teams, and courses.

```bash
python manage.py seed_demo
```

Creates:
- 3 demo users (Admin, Manager, Employee)
- 3 teams (Admin Team, Engineering, Sales)
- 6 sample courses with different statuses
- 3 course assignments for the employee

## Deployment Notes

### Environment Variables
Ensure all required secrets are set in production:
- `DATABASE_URL` - Use production Supabase connection string
- `DJANGO_SECRET_KEY` - Generate a strong random key
- `JWT_ACCESS_SECRET` - Generate a strong random key
- `JWT_REFRESH_SECRET` - Generate a strong random key (different from access)

### Security Checklist
- [ ] Set `DEBUG = False` in production
- [ ] Configure `ALLOWED_HOSTS` for your domain
- [ ] Restrict CORS to your frontend domain
- [ ] Use HTTPS for all connections
- [ ] Rotate JWT secrets periodically
- [ ] Set secure cookie flags if using session auth
- [ ] Enable rate limiting on auth endpoints

## Troubleshooting

### Database Connection Issues
If you see `Port could not be cast to integer` error:
- Ensure DATABASE_URL password special characters are properly URL-encoded
- The settings.py automatically handles URL encoding for passwords

### Preflight Check Failures
The `preflight.sh` script validates:
- DATABASE_URL exists
- No SQLite references
- No SQLite in migrations

If migrations fail, ensure you're using PostgreSQL, not SQLite.

### Frontend Not Loading
- Check that both workflows are running
- Verify frontend is on port 5000
- Clear browser cache and hard reload

## License

This project is for educational purposes.
