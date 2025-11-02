# Deployment Guide

This LMS platform is configured for deployment on Replit with a single unified deployment that serves both the frontend and backend.

## Architecture

**Option 1: Single Unified Deployment** (IMPLEMENTED)
- Django serves both API and React frontend
- Frontend builds into `backend/static/frontend`
- Django catch-all route serves `index.html` for all non-API routes
- Gunicorn binds to `$PORT` (provided by Replit)
- Deployment target: `autoscale`

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
1. Install frontend dependencies (`cd frontend && npm install`)
2. Build React app (`npm run build`) → outputs to `backend/static/frontend`
3. Install backend dependencies (`pip install -r requirements.txt`)
4. Collect static files (`python manage.py collectstatic --noinput`)
5. Run with Gunicorn (`gunicorn --bind 0.0.0.0:$PORT config.wsgi:application`)

### Manual Testing Locally
```bash
# 1. Build frontend
cd frontend
npm install
npm run build

# 2. Collect static files
cd ../backend
python manage.py collectstatic --noinput

# 3. Run Django on port 8000 (or $PORT in production)
gunicorn --bind 0.0.0.0:8000 --workers 4 config.wsgi:application
```

Visit `http://localhost:8000` - Django will serve:
- `/` → React app (index.html)
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

## Troubleshooting

### Port binding error
- Ensure Gunicorn binds to `$PORT` environment variable (provided by Replit)
- Command: `gunicorn --bind 0.0.0.0:$PORT config.wsgi:application`

### Static files not loading
- Run `python manage.py collectstatic --noinput`
- Check `backend/static/frontend/` contains built files
- Verify `STATIC_ROOT` and `STATICFILES_DIRS` in Django settings

### API calls failing
- Check `VITE_API_BASE_URL` in frontend `.env.local`
- For production, use empty string or same domain
- Verify CORS settings in Django allow requests

### TypeScript errors during build
- Use `npm run build` (skips type checking)
- Use `npm run build:check` for full type checking
- Fix TypeScript errors before production deployment
