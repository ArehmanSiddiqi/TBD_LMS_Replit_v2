# LMS Platform

## Overview

This is a Learning Management System (LMS) web application built with React and TypeScript. The platform provides role-based access control for three user types (Admin, Manager, and Employee) with features for course management, progress tracking, and team oversight. The application currently operates with mock data and in-memory authentication, designed as a frontend-only prototype that can be expanded with backend services.

**Status**: ✅ Complete and fully functional. The app is running on port 5000 with all features implemented and tested.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React 19 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Reloading)
- Single Page Application (SPA) architecture using React Router for client-side routing

**Styling & UI**
- Tailwind CSS for utility-first styling with custom color theming
- Component-based UI architecture with reusable components (`Button`, `Card`, `Input`, `ProgressBar`, etc.)
- Responsive design patterns using Tailwind's responsive utilities
- Mobile-first approach with grid layouts adapting to different screen sizes

**Authentication & Authorization**
- Client-side authentication using localStorage for session persistence
- Role-based access control (RBAC) with three roles: ADMIN, MANAGER, EMPLOYEE
- Protected routes using `RequireRole` component wrapper
- Role-specific dashboard redirects and feature access

**State Management**
- Local component state using React hooks (useState)
- No global state management library (Redux/Context) - authentication state managed through authService singleton
- Mock data stored in separate modules for easy backend integration later

**Data Flow**
- Mock data services (`/mocks`) simulate API responses
- Authentication service (`authService`) handles login, logout, and user session
- Type definitions centralized in `/types/index.ts` for consistency

### Routing Strategy

**Route Protection Pattern**
- Public route: `/login`
- Protected routes requiring authentication: all other routes
- Role-specific routes with automatic redirects based on user permissions
- Three main dashboard routes: `/employee`, `/manager`, `/admin`
- Role-based `/courses` route: conditionally renders EmployeeCoursesPage, ManagerCoursesPage, or AdminCoursesPage based on user role
- Shared routes: `/courses/:id`, `/team`, `/create-course`

**Navigation Structure**
- Employees: Access to personal courses and progress tracking - learner-focused experience
- Managers: Additional access to team management, employee management, and course creation - creator/assigner experience
- Admins: Full system access including course approval workflows, platform analytics, and system-wide metrics - reviewer/publisher experience

### Component Architecture

**Layout Components**
- `PageHeader`: Global navigation with role-aware menu items
- `BackLink`: Reusable navigation component for hierarchical pages

**UI Components** 
- Atomic design pattern with base components (`Button`, `Card`, `Input`, etc.)
- Consistent props interface following React best practices
- Accessibility-conscious design (proper form labels, semantic HTML)

**Page Components**
- Route-level components for each major view
- Consistent structure: header, content area, action buttons
- Data fetching happens at page level from mock services

### Mock Data Architecture

**Current Approach**
- In-memory mock data for rapid prototyping
- Predefined users with fixed credentials
- Mock courses, team members, employees, and statistics
- Course approval states (Published, Draft, Needs Revision)
- Platform insights and admin analytics
- Data persists only in session (no backend calls)

**Migration Path**
- Mock services designed to be easily replaced with API calls
- Type definitions already established for API contracts
- Service layer pattern ready for HTTP client integration

### Admin Features

**Admin Dashboard**
- Top-level metrics cards: Total Assigned, Started, Completed, Active Users (7d)
- All Courses table with inline approval actions
- Course status badges: Published (green), Draft (gray), Needs Revision (yellow)
- Inactive Users tracking (30+ days with no activity)
- Platform Insights section: Completion Rate, Active Courses, Total Users
- Real-time course approval/rejection workflow

**Course Approval Flow**
- Modal-based approval interface with course details display
- Two-action workflow: Approve & Publish or Reject with Note
- Manager notes displayed for context
- Visual status updates on approval/rejection
- Smooth transitions and success animations

**Admin Courses Page**
- Grid view of all courses with thumbnails
- Status filtering: All, Published, Draft, Needs Revision
- Live search across title, description, and creator
- Hover tooltips showing last update date and creator name
- View and Approve/Review buttons per course card
- Consistent with employee/manager course views

**Components & Modals**
- CourseApprovalModal: Full approval workflow with two-step rejection process
- Hover tooltips using CSS group-hover patterns
- Reusable status badge rendering
- Consistent with existing design system (Button, Card, Input, Modal)

### Role-Based Courses Experience

**Employee Courses Page (EmployeeCoursesPage)**
- "My Courses" header with search functionality
- Learner-focused experience with personal progress tracking
- Learning status badges: Completed (green), In Progress (blue), Not Started (gray)
- Progress bars for in-progress courses (0-100%)
- Action buttons adapt to course state: "Start Course", "Continue", or "Review"
- Hover tooltips showing "Assigned by [Manager Name]"
- No create, assign, approve, or administrative actions visible
- Grid layout with course thumbnails, titles, descriptions, duration, and level

**Manager Courses Page (ManagerCoursesPage)**
- "My Courses" header with prominent "Create Course" button
- Search bar + status filter dropdown (All/Published/Draft/Awaiting Approval/Needs Revision)
- Course creator and team assigner experience
- Status badges: Published (green), Draft (gray), Awaiting Approval (yellow), Needs Revision (red)
- All courses show View + Assign buttons (always visible)
- Draft courses: Additional Edit button and disabled Publish button with "Pending Admin Approval" tooltip
- Awaiting Approval courses: Yellow info box explaining admin review status
- Published courses: Additional "Assign to Team" button for quick team assignment
- Course metadata shown: Creator, Level, Duration
- Grid layout consistent with employee and admin views

**Design Consistency**
- All three role views use the same grid layout, typography, and hover interactions
- Shared Card and Button components maintain visual unity
- Role-based visibility: buttons, badges, and tooltips differ per role
- Smooth transitions between different course states
- Mobile-responsive grid (1 column mobile, 2 columns tablet, 3 columns desktop)
- Consistent empty states when no courses match search/filter criteria

### Development Configuration

**Vite Configuration**
- Custom host settings for Replit environment (listening on 0.0.0.0)
- Port 5000 for both dev and preview modes
- Allowed hosts configured for Replit domains
- HMR settings optimized for cloud development environment

**TypeScript Configuration**
- Strict mode enabled for maximum type safety
- Separate configs for app code and build tooling
- Module resolution set to bundler mode
- JSX configured for React 19's automatic runtime

## External Dependencies

### Core Dependencies

**React Ecosystem**
- `react` (^19.1.1) - UI framework
- `react-dom` (^19.1.1) - DOM renderer
- `react-router-dom` (^6.28.0) - Client-side routing

### Development Dependencies

**Build Tools**
- `vite` (^7.1.7) - Build tool and dev server
- `@vitejs/plugin-react` (^5.0.4) - React integration for Vite

**TypeScript**
- `typescript` (~5.9.3) - Type checking
- `@types/react` (^19.1.16) - React type definitions
- `@types/react-dom` (^19.1.9) - React DOM type definitions
- `@types/node` (^24.6.0) - Node.js type definitions

**CSS & Styling**
- `tailwindcss` (^3.4.18) - Utility-first CSS framework
- `autoprefixer` (^10.4.21) - PostCSS plugin for vendor prefixes
- `postcss` (^8.5.6) - CSS transformation tool

**Code Quality**
- `eslint` (^9.36.0) - JavaScript/TypeScript linting
- `@eslint/js` (^9.36.0) - ESLint JavaScript rules
- `typescript-eslint` (^8.45.0) - TypeScript-specific linting
- `eslint-plugin-react-hooks` (^5.2.0) - React hooks linting
- `eslint-plugin-react-refresh` (^0.4.22) - React refresh linting
- `globals` (^16.4.0) - Global variables definitions

## Backend Architecture (NEW - Django REST API)

### Overview
Full Django 5 + Django REST Framework backend with JWT authentication, role-based permissions, and Supabase PostgreSQL database.

**Status**: ✅ Complete and running on port 8000. All endpoints secured with JWT authentication.

### Technology Stack

- **Django 5.1.4** - Python web framework
- **Django REST Framework 3.15.2** - RESTful API toolkit
- **PostgreSQL (Supabase)** - Production database with connection pooling
- **PyJWT 2.10.1** - JWT token generation and validation
- **psycopg 3.2.3** - PostgreSQL adapter for Python
- **django-cors-headers 4.6.0** - CORS support for React frontend

### Authentication System

**JWT-Based Authentication**
- Custom `JWTAuthentication` class validates Bearer tokens
- Access tokens: 1 hour lifetime (signed with JWT_ACCESS_SECRET)
- Refresh tokens: 7 day lifetime (signed with JWT_REFRESH_SECRET)
- Refresh token blacklist for logout functionality
- Timezone-aware token generation using UTC

**Endpoints:**
- `POST /api/v1/auth/login` - Email/password login, returns JWT tokens
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Blacklist refresh token

### Authorization & Permissions

**Permission Classes:**
- `IsAuthenticated` - Requires valid JWT token
- `IsAdmin` - Admin role only
- `IsManagerOrAdmin` - Manager, TL, SRMGR, or Admin roles
- `IsOwnerOrAdmin` - Resource owner or Admin

**Protected Resources:**
- All ModelViewSets require authentication by default
- User & Team management: Manager+ roles only
- Course approvals: Manager+ roles only
- Assignments, Progress, Notifications: Owner or Admin

**Public Endpoints:**
- `/api/v1/auth/*` - Authentication endpoints
- `/api/v1/health/db` - Database health check

### Database Models

**User Model (Custom AbstractBaseUser)**
- Email as username (unique)
- Role: ADMIN | MANAGER | TL | SRMGR | EMPLOYEE
- Optional team assignment
- Custom UserManager for email-based user creation
- Django admin integration

**Core LMS Models:**
- **Team**: Name, description, manager, members
- **Course**: Title, description, video_url, thumbnail_url, status, level, created_by
- **Resource**: Course materials (Google Docs/Slides/PDF links)
- **Assignment**: User-course relationship with progress tracking
- **ProgressEvent**: Historical progress records
- **Notification**: User notifications with read tracking
- **Approval**: Course approval workflow (requested_by, approved_by, status)
- **RefreshToken**: JWT refresh token storage with blacklist

**Database Configuration:**
- Supabase PostgreSQL with automatic URL password encoding
- Connection pooling (600s max age)
- Automatic migrations on startup via workflow
- SQLite explicitly blocked via preflight checks

### API Endpoints

**Base URL:** `http://localhost:8000/api/v1/`

**Resource Endpoints** (all require authentication):
- `/users/` - User management (Manager+ only)
- `/teams/` - Team management (Manager+ only)
- `/courses/` - Course CRUD operations
- `/resources/` - Course resource links
- `/assignments/` - Course assignments
- `/progress-events/` - Progress history
- `/notifications/` - User notifications
- `/approvals/` - Course approval workflow (Manager+ only)

All endpoints support standard REST operations (GET, POST, PUT, PATCH, DELETE).

### Security Features

✅ **Implemented:**
- JWT authentication with separate access/refresh secrets
- Token blacklisting for logout
- Role-based access control
- Password hashing via Django's auth system
- CORS configuration for frontend integration
- SQL injection protection via Django ORM
- Environment-based secrets management

⚠️ **Production Considerations:**
- Set `DEBUG = False`
- Configure specific `ALLOWED_HOSTS`
- Restrict CORS to frontend domain only
- Use HTTPS for all connections
- Implement rate limiting on auth endpoints
- Regular security updates for dependencies

### Management Commands

**`python manage.py seed_demo`**
Creates demo data for testing:
- 3 users (admin, manager, employee)
- 3 teams
- 6 sample courses
- 3 course assignments

**Credentials:**
- Admin: `admin@company.com` / `admin123`
- Manager: `manager@company.com` / `manager123`
- Employee: `employee@company.com` / `employee123`

### Third-Party Services

**Video Hosting**
- YouTube embeds for course videos
- Could integrate Vimeo, Wistia, or custom solution

**Image CDN**
- Unsplash URLs for course thumbnails
- Could migrate to Cloudinary, imgix, or S3

**Future Enhancements**
- Email service for notifications (SendGrid, Mailgun)
- Analytics tracking (Mixpanel, Amplitude)
- File uploads for resources (AWS S3, Cloudflare R2)