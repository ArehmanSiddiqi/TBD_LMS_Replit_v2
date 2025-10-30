import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../auth/authService';
import { mockCourses } from '../mocks/courses';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';

export const EmployeeDashboard: React.FC = () => {
  const currentUser = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Continue your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{course.duration}</span>
                  <span>{course.createdBy}</span>
                </div>
                {course.progress !== undefined && (
                  <ProgressBar progress={course.progress} />
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
