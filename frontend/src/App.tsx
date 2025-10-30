import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './auth/authService';
import { RequireRole } from './routes/RequireRole';
import { Login } from './pages/Login';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CourseView } from './pages/CourseView';
import { CreateNewCourse } from './pages/CreateNewCourse';
import { EmployeeCoursesPage } from './pages/EmployeeCoursesPage';
import { ManagerCoursesPage } from './pages/ManagerCoursesPage';
import { AdminCoursesPage } from './pages/AdminCoursesPage';
import { MyTeamPage } from './pages/MyTeamPage';
import { EmployeeManagementPage } from './pages/EmployeeManagementPage';

function App() {
  const currentUser = authService.getCurrentUser();
  
  const getDefaultRedirect = () => {
    if (!currentUser) return '/login';
    return authService.getRedirectPath(currentUser.role);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/employee"
          element={
            <RequireRole>
              <EmployeeDashboard />
            </RequireRole>
          }
        />
        
        <Route
          path="/manager"
          element={
            <RequireRole allowedRoles={['MANAGER', 'ADMIN']}>
              <ManagerDashboard />
            </RequireRole>
          }
        />
        
        <Route
          path="/admin"
          element={
            <RequireRole allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RequireRole>
          }
        />
        
        <Route
          path="/courses"
          element={
            <RequireRole>
              {currentUser?.role === 'ADMIN' && <AdminCoursesPage />}
              {currentUser?.role === 'MANAGER' && <ManagerCoursesPage currentUser={currentUser} />}
              {currentUser?.role === 'EMPLOYEE' && <EmployeeCoursesPage currentUser={currentUser} />}
            </RequireRole>
          }
        />
        
        <Route
          path="/courses/:id"
          element={
            <RequireRole>
              <CourseView />
            </RequireRole>
          }
        />
        
        <Route
          path="/courses/new"
          element={
            <RequireRole allowedRoles={['MANAGER', 'ADMIN']}>
              <CreateNewCourse />
            </RequireRole>
          }
        />
        
        <Route
          path="/team"
          element={
            <RequireRole allowedRoles={['MANAGER', 'ADMIN']}>
              <MyTeamPage />
            </RequireRole>
          }
        />
        
        <Route
          path="/employees"
          element={
            <RequireRole allowedRoles={['MANAGER', 'ADMIN']}>
              <EmployeeManagementPage />
            </RequireRole>
          }
        />
        
        <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />
        <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
