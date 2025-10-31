import type { User, UserRole } from '../types';

interface Credentials {
  email: string;
  password: string;
}

const PRESET_USERS: Record<string, { password: string; role: UserRole; name: string }> = {
  'admin@example.com': {
    password: 'demo123',
    role: 'ADMIN',
    name: 'Admin User',
  },
  'manager@example.com': {
    password: 'demo123',
    role: 'MANAGER',
    name: 'Manager User',
  },
  'employee@example.com': {
    password: 'demo123',
    role: 'EMPLOYEE',
    name: 'Employee User',
  },
};

export const authService = {
  login: (credentials: Credentials): User | null => {
    const userConfig = PRESET_USERS[credentials.email];
    
    if (userConfig && userConfig.password === credentials.password) {
      const user: User = {
        email: credentials.email,
        role: userConfig.role,
        name: userConfig.name,
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    }
    
    return null;
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
