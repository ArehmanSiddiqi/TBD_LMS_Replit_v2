# LMS Platform

## Overview
This is a Learning Management System (LMS) web application built with React, TypeScript, and a Django REST Framework backend. The platform provides role-based access control (Admin, Manager, Employee) for course management, progress tracking, and team oversight. It's a full-stack application designed to be scalable and maintainable, leveraging a Supabase PostgreSQL database and JWT authentication.

## Recent Changes (Oct 31, 2025)
- **Complete Assignment & Progress Tracking System**: Implemented end-to-end course assignment and automatic progress tracking
  - **Backend**:
    - Assignment endpoints: create (`POST /assignments/`), list mine (`GET /assignments/mine/`), list team (`GET /assignments/team/`), update progress (`PATCH /assignments/{id}/progress/`)
    - MinimalCourseSerializer with nested course data in assignments (title, thumbnail, video_url, duration, etc.)
    - User search endpoint (`GET /users/search/?q=`) for managers to find employees
    - Team management endpoint (`POST /team/add_member/`) to build teams
    - Auto-completion logic: assignments automatically set to "completed" when progress reaches 100%
    - Upsert logic: creating assignment for existing user+course pair returns existing assignment
  - **Frontend**:
    - YouTube IFrame API integration for automatic progress tracking every 10 seconds
    - Progress updates sent when change ≥5%, auto status updates (in_progress → completed)
    - Employee Dashboard shows only assigned courses from `/assignments/mine/`
    - Courses page with tabs: "My Courses" (assignments) vs "All Courses" (published)
    - AssignCourseModal: assign one course to multiple employees with multi-select
    - AssignCoursesToUserModal: assign multiple courses to one employee
    - Manager Dashboard: real metrics from team assignments (active learners, completion rate, avg progress)
    - MyTeamPage: employee search, team management, assignment statistics per member
    - Start Course logic: creates assignment and immediately begins video playback
  - **Data Flow**: All mock data removed, full API integration throughout the platform
  - **User Experience**: Seamless progress tracking without manual intervention, two-way assignment workflows

- **Course Creation & Approval Workflow**: Implemented complete course creation with role-based approval system
  - Managers create courses → forced to "awaiting_approval" status, creates Approval record
  - Admins can create courses directly as "draft" or "published", or approve/reject manager courses
  - Admin-only actions: publish (approve & publish), unpublish (revert to draft), reject (with notes)
  - Security: Only admins can update/delete courses, preventing managers from bypassing approval via PATCH
  - Frontend: CreateNewCourse form with validation, YouTube URL normalization, live thumbnail preview

- **Employee Management - Edit Functionality**: Fixed and improved employee edit feature
  - Admin users can now successfully update employee information (name, job title, role)
  - Improved validation with clear error messages for required fields
  - Backend validates data integrity (no empty names, valid roles only)
  - Role-based permissions enforced (ADMIN only for updates)
  - Delete functionality with self-deletion prevention

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework & Build Tool**: React 19 with TypeScript, Vite for fast HMR. Single Page Application (SPA) using React Router.
- **Styling & UI**: Tailwind CSS for utility-first styling, component-based UI, responsive design with a mobile-first approach.
- **Authentication & Authorization**: Client-side authentication using localStorage, Role-Based Access Control (RBAC) with ADMIN, MANAGER, EMPLOYEE roles, protected routes with `RequireRole` component.
- **State Management**: Local component state with React hooks. Authentication state managed via a singleton service.
- **Data Flow**: Full API integration with assignmentsService, coursesService, usersService, and teamsService. No mock data.
- **Routing Strategy**: Public `/login` route, all other routes protected. Role-specific dashboards (`/employee`, `/manager`, `/admin`) and course views.
- **Component Architecture**: Layout components (`PageHeader`, `BackLink`), atomic UI components (`Button`, `Card`, `Input`), and route-level page components.

### Backend Architecture
- **Technology Stack**: Django 5.1.4, Django REST Framework 3.15.2, PostgreSQL (Supabase), PyJWT, psycopg.
- **Authentication System**: JWT-based with access (1hr) and refresh (7 days) tokens. Includes registration (employee role only), login, refresh, logout, and secure password reset.
- **Authorization & Permissions**: Custom permission classes (`IsAuthenticated`, `IsAdmin`, `IsManagerOrAdmin`, `IsOwnerOrAdmin`) enforce role-based access to API resources.
- **Database Models**: Custom User model (email as username, role), Team, Course, Resource, Assignment, ProgressEvent, Notification, Approval, RefreshToken, PasswordResetToken.
- **API Endpoints**: RESTful endpoints for users, teams, courses, resources, assignments, progress-events, notifications, and approvals.
- **Security Features**: JWT with separate secrets, token blacklisting, RBAC, secure password reset, password hashing, CORS, SQL injection protection, environment-based secrets.
- **Management Commands**: `python manage.py seed_demo` to populate demo data.

## External Dependencies

### Frontend
- **React Ecosystem**: `react`, `react-dom`, `react-router-dom`
- **Build Tools**: `vite`, `@vitejs/plugin-react`
- **TypeScript**: `typescript`, `@types/react`, `@types/react-dom`, `@types/node`
- **CSS & Styling**: `tailwindcss`, `autoprefixer`, `postcss`
- **Code Quality**: `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`

### Backend
- **Database**: PostgreSQL (Supabase)
- **Authentication**: PyJWT
- **CORS**: `django-cors-headers`

### Third-Party Services (Integrated)
- **Video Hosting**: YouTube embeds
- **Image CDN**: Unsplash (for course thumbnails)