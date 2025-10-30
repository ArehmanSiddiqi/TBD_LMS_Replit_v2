import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { UserRole } from '../types';

interface RequireRoleProps {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles, children }) => {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const redirectPath = authService.getRedirectPath(currentUser.role);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
