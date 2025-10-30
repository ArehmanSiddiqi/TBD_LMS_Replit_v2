import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../auth/authService';
import { Button } from '../ui/Button';

interface PageHeaderProps {
  currentUser: { email: string; role: string; name: string } | null;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ currentUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const showManagerFeatures = currentUser?.role === 'MANAGER' || currentUser?.role === 'ADMIN';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">LMS</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link to="/employee" className="text-gray-600 hover:text-gray-900 font-medium">
                Home
              </Link>
              <Link to="/courses" className="text-gray-600 hover:text-gray-900 font-medium">
                Courses
              </Link>
              {showManagerFeatures && (
                <>
                  <Link to="/team" className="text-gray-600 hover:text-gray-900 font-medium">
                    My Team
                  </Link>
                  <Link to="/employees" className="text-gray-600 hover:text-gray-900 font-medium">
                    Employees
                  </Link>
                </>
              )}
              <Link to={`/${currentUser?.role.toLowerCase()}`} className="text-gray-600 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <input
                type="search"
                placeholder="Search courses..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            
            {showManagerFeatures && (
              <Link to="/courses/new">
                <Button variant="primary">Create Course</Button>
              </Link>
            )}

            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.role}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <Button variant="secondary" onClick={handleLogout} className="text-sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
