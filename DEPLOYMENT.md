# Deployment Guide

This LMS platform is configured for deployment on Replit with a single unified deployment that serves both the frontend and backend.

## Architecture

**Single Unified Deployment** (IMPLEMENTED)
- Django serves both API and React frontend on the same domain
- Frontend builds into `backend/static/frontend/` with base path `/static/frontend/`
- WhiteNoise serves static files (frontend bundle + assets) in production
- Django catch-all route serves `index.html` for all non-API, non-static routes
- Gunicorn binds to `$PORT` (provided by Replit)
- Deployment target: `autoscale`

## Key Configuration Details

### Static File Serving
- **Vite Build Configuration**: `base: '/static/frontend/'` ensures all asset URLs point to `/static/frontend/assets/...`
- **Django Static Files**: `STATIC_URL = '/static/'` with WhiteNoise middleware serves files efficiently
- **URL Routing Order**: Static file patterns are evaluated BEFORE the React catch-all route to prevent conflicts
- **WhiteNoise**: Compresses and serves static files with `CompressedManifestStaticFilesStorage`

### URL Routing Strategy
1. `/admin/` → Django admin panel
2. `/api/v1/` → Django REST API endpoints
3. `/static/` → Static files (served by WhiteNoise in production, Django dev server in DEBUG mode)
4. `/*` (catch-all) → React SPA (`index.html`)

## Environment Variables

### Development (.env files)
Create `frontend/.env.local` with:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Backend uses environment variables already configured in Replit:
- `DATABASE_URL` - Supabase Postgres connection
- `DJANGO_SECRET_KEY` - Django secret
- `JWT_ACCESS_SECRET` - JWT access token secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret

### Production
For production deployment, `VITE_API_BASE_URL` can be empty or point to the same domain since frontend and backend are served together.

## Deployment Process

### Automatic (Replit Deploy)
The deployment is configured in `.replit` and will:
1. **Build Frontend**:
   - Install dependencies: `cd frontend && npm install`
   - Build React app: `npm run build` → outputs to `backend/static/frontend/`
   - Assets are built with base path `/static/frontend/`
2. **Prepare Backend**:
   - Install dependencies: `pip install -r backend/requirements.txt`
   - Collect static files: `python manage.py collectstatic --noinput` → collects to `backend/staticfiles/`
3. **Run Production Server**:
   - Start Gunicorn: `gunicorn --bind 0.0.0.0:$PORT --workers 4 config.wsgi:application`
   - WhiteNoise middleware serves static files

### Manual Testing Locally

#### Development Mode (with hot reload)
```bash
# Terminal 1: Run Django backend
cd backend
python manage.py runserver 0.0.0.0:8000

# Terminal 2: Run Vite dev server
cd frontend
npm run dev
```
- Frontend: `http://localhost:5000` (Vite dev server)
- Backend: `http://localhost:8000` (Django dev server)
- Frontend makes API calls to `http://localhost:8000/api/v1/` (via `VITE_API_BASE_URL`)

#### Production Mode (testing gunicorn)
```bash
# 1. Build frontend
cd frontend
npm install
npm run build

# 2. Collect static files
cd ../backend
python manage.py collectstatic --noinput

# 3. Run with Gunicorn
gunicorn --bind 0.0.0.0:8000 --workers 4 config.wsgi:application
```

Visit `http://localhost:8000` - Django with WhiteNoise will serve:
- `/` → React app (`index.html`)
- `/static/frontend/assets/*` → React bundle (JS, CSS)
- `/api/v1/*` → Django REST API
- All other routes → React app (client-side routing)

## File Structure

```
project/
├── frontend/
│   ├── src/          # React source code
│   ├── .env.example  # Example environment variables
│   └── vite.config.ts # Vite configuration (build to ../backend/static/frontend)
│
├── backend/
│   ├── config/       # Django settings
│   ├── core/         # Django app
│   ├── static/       # Built frontend files (generated)
│   ├── staticfiles/  # Collected static files (generated)
│   └── requirements.txt # Python dependencies
│
└── .replit          # Replit deployment configuration
```

## API Base URL Configuration

The frontend uses `VITE_API_BASE_URL` environment variable to configure where API requests go:

- **Development**: Set to `http://127.0.0.1:8000` to connect to local Django server
- **Production**: Can be empty (same domain) or set to specific backend URL if using separate deployments

All API calls in the frontend go through `frontend/src/services/api.ts` which automatically:
1. Reads `VITE_API_BASE_URL` from environment
2. Appends `/api/v1` prefix
3. Adds JWT authentication headers
4. Handles 401 redirects to login

## Configuration Summary

### Backend (Django)
- **Static File Middleware**: WhiteNoise (`whitenoise.middleware.WhiteNoiseMiddleware`)
- **Static Storage**: `whitenoise.storage.CompressedManifestStaticFilesStorage`
- **Static URL**: `/static/`
- **Static Root**: `backend/staticfiles/` (collectstatic output)
- **Static Dirs**: `backend/static/` (includes built frontend)
- **URL Routing**: Admin → API → Static → React catch-all

### Frontend (Vite + React)
- **Base Path**: `/static/frontend/` (aligns with Django's STATIC_URL)
- **Build Output**: `backend/static/frontend/` (served by Django)
- **API Base URL**: `VITE_API_BASE_URL` environment variable
  - Development: `http://127.0.0.1:8000`
  - Production: Empty (relative URLs to same domain)

## Troubleshooting

### Port binding error
- Ensure Gunicorn binds to `$PORT` environment variable (provided by Replit)
- Command: `gunicorn --bind 0.0.0.0:$PORT config.wsgi:application`

### Static files not loading (blank page, 404s)
1. Verify frontend built correctly: Check `backend/static/frontend/index.html` exists
2. Verify assets have correct paths: Open `index.html`, confirm URLs start with `/static/frontend/`
3. Run `python manage.py collectstatic --noinput`
4. Check URL routing order in `backend/config/urls.py` (static patterns before catch-all)
5. Verify WhiteNoise middleware is enabled in `MIDDLEWARE` settings

### API calls failing (CORS, 401, network errors)
- **Development**: Check `VITE_API_BASE_URL` in `frontend/.env.local` points to Django server
- **Production**: Use empty string or relative URL (same domain)
- Verify CORS settings in Django (`CORS_ALLOWED_ORIGINS`, `CORS_ALLOW_CREDENTIALS`)
- Check browser console for specific error messages

### TypeScript errors during build
- Use `npm run build` (skips type checking for faster builds)
- Use `npm run build:check` for full type checking
- Fix TypeScript errors before production deployment

### React router not working (404 on refresh)
- Ensure Django catch-all route is configured in `backend/config/urls.py`
- Catch-all must be LAST in URL patterns (after static files)
- Verify `TEMPLATES` in Django settings includes `backend/static/frontend/`
