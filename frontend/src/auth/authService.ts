import type { User, UserRole } from '../types';
import { api } from '../services/api';

interface Credentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    jobTitle: string;
  };
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const data = await api.post<LoginResponse>('/auth/login', { email, password }, { requiresAuth: false });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  register: async (registerData: RegisterData): Promise<LoginResponse> => {
    const data = await api.post<LoginResponse>('/auth/register', registerData, { requiresAuth: false });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  passwordResetRequest: async (email: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/password-reset/request', { email }, { requiresAuth: false });
  },

  logout: (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        return {
          email: userData.email,
          role: userData.role,
          name: userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}`.trim()
            : userData.email
        };
      } catch {
        return null;
      }
    }
    return null;
  },

  getRedirectPath: (role: UserRole): string => {
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'MANAGER':
        return '/manager';
      case 'EMPLOYEE':
        return '/employee';
      default:
        return '/employee';
    }
  },
};
