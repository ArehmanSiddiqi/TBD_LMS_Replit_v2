import React from 'react';
import { authService } from '../auth/authService';
import { EmployeeCoursesPage } from '../pages/EmployeeCoursesPage';
import { ManagerCoursesPage } from '../pages/ManagerCoursesPage';
import { AdminCoursesPage } from '../pages/AdminCoursesPage';

export const CoursesRouter: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  
  if (!currentUser) {
    return null;
  }

  if (currentUser.role === 'ADMIN') {
    return <AdminCoursesPage />;
  }
  
  if (currentUser.role === 'MANAGER') {
    return <ManagerCoursesPage currentUser={currentUser} />;
  }
  
  return <EmployeeCoursesPage currentUser={currentUser} />;
};
