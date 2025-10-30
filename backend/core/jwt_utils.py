import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from .models import RefreshToken


def create_access_token(user):
    now = datetime.now(timezone.utc)
    payload = {
        'user_id': user.id,
        'email': user.email,
        'role': user.role,
        'exp': now + timedelta(seconds=settings.JWT_ACCESS_TOKEN_LIFETIME),
        'iat': now,
        'type': 'access'
    }
    return jwt.encode(payload, settings.JWT_ACCESS_SECRET, algorithm='HS256')


def create_refresh_token(user):
    now = datetime.now(timezone.utc)
    payload = {
        'user_id': user.id,
        'exp': now + timedelta(seconds=settings.JWT_REFRESH_TOKEN_LIFETIME),
        'iat': now,
        'type': 'refresh'
    }
    token = jwt.encode(payload, settings.JWT_REFRESH_SECRET, algorithm='HS256')
    
    RefreshToken.objects.create(
        user=user,
        token=token,
        expires_at=now + timedelta(seconds=settings.JWT_REFRESH_TOKEN_LIFETIME)
    )
    
    return token


def decode_access_token(token):
    try:
        payload = jwt.decode(token, settings.JWT_ACCESS_SECRET, algorithms=['HS256'])
        if payload.get('type') != 'access':
            return None
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def decode_refresh_token(token):
    try:
        payload = jwt.decode(token, settings.JWT_REFRESH_SECRET, algorithms=['HS256'])
        if payload.get('type') != 'refresh':
            return None
        
        refresh_token = RefreshToken.objects.filter(
            token=token,
            is_blacklisted=False
        ).first()
        
        if not refresh_token:
            return None
            
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def blacklist_refresh_token(token):
    RefreshToken.objects.filter(token=token).update(is_blacklisted=True)
