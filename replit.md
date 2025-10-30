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
- Shared routes: `/courses`, `/courses/:id`, `/team`, `/create-course`

**Navigation Structure**
- Employees: Access to personal courses and progress tracking
- Managers: Additional access to team management and course creation
- Admins: Full system access including system-wide analytics

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
- Mock courses, team members, and statistics
- Data persists only in session (no backend calls)

**Migration Path**
- Mock services designed to be easily replaced with API calls
- Type definitions already established for API contracts
- Service layer pattern ready for HTTP client integration

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

### Future Integration Points

**Potential Backend Services** (not currently implemented)
- REST API or GraphQL endpoint for course data
- Authentication service (JWT, OAuth, or session-based)
- Database for persistent storage (candidates: PostgreSQL, MongoDB)
- File storage service for course videos and thumbnails
- Analytics service for tracking user progress and engagement

**Third-Party Services** (currently using placeholders)
- Video hosting (YouTube embeds in mock data, could integrate Vimeo, Wistia, or custom solution)
- Image CDN for course thumbnails (currently using Unsplash URLs)
- Email service for notifications (not implemented)