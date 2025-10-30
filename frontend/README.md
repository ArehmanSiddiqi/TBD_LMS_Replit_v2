# LMS Platform - Frontend

A React-based Learning Management System with role-based authentication and course management features.

## Features

- **Role-Based Authentication**: Three user roles (Admin, Manager, Employee) with different permissions
- **Course Management**: View courses, track progress, and create new courses (Manager/Admin only)
- **Team Management**: Monitor team member progress (Manager/Admin only)
- **Dashboard**: Role-specific dashboards with metrics and KPIs
- **Responsive Design**: Built with Tailwind CSS for mobile-friendly layouts

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Mock Data** - In-memory authentication and data (no backend required)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Demo Users

Use these credentials to test different user roles:

- **Admin**: admin@example.com / demo123
- **Manager**: manager@example.com / demo123
- **Employee**: employee@example.com / demo123

## Project Structure

```
src/
├── auth/              # Authentication service
├── components/        # Reusable UI components
├── mocks/             # Mock data
├── pages/             # Page components
├── routes/            # Route protection
└── types/             # TypeScript types
```

## Available Routes

- `/login` - Login page
- `/employee` - Employee dashboard
- `/manager` - Manager dashboard
- `/admin` - Admin dashboard
- `/courses` - Course catalog
- `/courses/:id` - Course detail view
- `/courses/new` - Create new course (Manager/Admin only)
- `/team` - Team management (Manager/Admin only)

## Build

```bash
npm run build
```
