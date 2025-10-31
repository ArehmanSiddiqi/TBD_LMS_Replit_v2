# LMS Platform

## Overview
This is a Learning Management System (LMS) web application built with React, TypeScript, and a Django REST Framework backend. The platform provides role-based access control (Admin, Manager, Employee) for course management, progress tracking, and team oversight. It's a full-stack application designed to be scalable and maintainable, leveraging a Supabase PostgreSQL database and JWT authentication.

## Recent Changes (Oct 31, 2025)
- **Course Creation & Approval Workflow**: Implemented complete course creation with role-based approval system
  - Managers create courses → forced to "awaiting_approval" status, creates Approval record
  - Admins can create courses directly as "draft" or "published", or approve/reject manager courses
  - Admin-only actions: publish (approve & publish), unpublish (revert to draft), reject (with notes)
  - Security: Only admins can update/delete courses, preventing managers from bypassing approval via PATCH
  - Frontend: CreateNewCourse form with validation, YouTube URL normalization, live thumbnail preview
  
- **Employee Dashboard - API Integration**: Fixed employee courses page to display real published courses
  - Replaced mock data with API calls using coursesService
  - Employees now see all published courses from the database
  - Dynamic course counts and proper filtering
  - Loading states and error handling

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
- **Data Flow**: Mock data services (for frontend prototyping) designed for easy replacement with API calls.
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