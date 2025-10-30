import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { mockCourses } from '../mocks/courses';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';

interface EmployeeCoursesPageProps {
  currentUser: User | null;
}

export const EmployeeCoursesPage: React.FC<EmployeeCoursesPageProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = mockCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLearningStatusBadge = (status: string | undefined, progress: number | undefined) => {
    if (progress === 100 || status === 'completed') {
      return <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded">Completed</span>;
    }
    if (progress && progress > 0) {
      return <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded">In Progress</span>;
    }
    return <span className="bg-gray-400 text-white text-xs font-medium px-3 py-1 rounded">Not Started</span>;
  };

  const getButtonText = (progress: number | undefined) => {
    if (progress && progress > 0 && progress < 100) {
      return 'Continue';
    }
    if (progress === 100) {
      return 'Review';
    }
    return 'Start Course';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Continue your learning journey</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  {getLearningStatusBadge(course.learningStatus, course.progress)}
                </div>
              </div>
              
              <div className="p-6">
                <div className="relative group mb-3">
                  <h3 className="text-xl font-bold text-gray-900 cursor-pointer">
                    {course.title}
                  </h3>
                  {course.assignedBy && (
                    <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 z-10 whitespace-nowrap">
                      Assigned by {course.assignedBy}
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                
                {course.progress !== undefined && course.progress > 0 && course.progress < 100 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs font-semibold text-gray-900">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{course.duration}</span>
                  <span className="font-medium">{course.level || 'Beginner'}</span>
                </div>
                
                <Button
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="w-full"
                >
                  {getButtonText(course.progress)}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No courses found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
