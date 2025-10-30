import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './auth/authService';
import { RequireRole } from './routes/RequireRole';
import { Login } from './pages/Login';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CourseView } from './pages/CourseView';
import { CreateNewCourse } from './pages/CreateNewCourse';
import { CoursesList } from './pages/CoursesList';
import { TeamPage } from './pages/TeamPage';

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
              <CoursesList />
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
              <TeamPage />
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
