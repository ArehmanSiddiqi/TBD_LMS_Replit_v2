import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, CourseStatus } from '../types';
import { mockCourses } from '../mocks/courses';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface ManagerCoursesPageProps {
  currentUser: User | null;
}

export const ManagerCoursesPage: React.FC<ManagerCoursesPageProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || course.courseStatus === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: CourseStatus | undefined) => {
    switch (status) {
      case 'published':
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded">Published</span>;
      case 'draft':
        return <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded">Draft</span>;
      case 'awaiting_approval':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded">Awaiting Approval</span>;
      case 'needs_revision':
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded">Needs Revision</span>;
      default:
        return <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded">Draft</span>;
    }
  };

  const handleAssign = (courseId: string) => {
    console.log('Assign course:', courseId);
  };

  const handleEdit = (courseId: string) => {
    console.log('Edit course:', courseId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-2">Create and manage your team's learning content</p>
          </div>
          <Button onClick={() => navigate('/create-course')}>
            Create Course
          </Button>
        </div>

        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="awaiting_approval">Awaiting Approval</option>
            <option value="needs_revision">Needs Revision</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isDraft = course.courseStatus === 'draft';
            const isPublished = course.courseStatus === 'published';
            const isAwaitingApproval = course.courseStatus === 'awaiting_approval';

            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">
                      {course.title}
                    </h3>
                    {getStatusBadge(course.courseStatus)}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Creator</span>
                      <span className="font-medium text-gray-900">{course.createdBy}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Level</span>
                      <span className="font-medium text-gray-900">{course.level || 'Beginner'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Duration</span>
                      <span className="font-medium text-gray-900">{course.duration}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigate(`/courses/${course.id}`)}
                        variant="secondary"
                        className="flex-1 text-sm"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => handleAssign(course.id)}
                        className="flex-1 text-sm"
                      >
                        Assign
                      </Button>
                    </div>
                    
                    {isDraft && (
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleEdit(course.id)}
                          variant="secondary"
                          className="w-full text-sm"
                        >
                          Edit
                        </Button>
                        <div className="relative group">
                          <Button
                            disabled
                            className="w-full text-sm opacity-50 cursor-not-allowed"
                          >
                            Publish
                          </Button>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap">
                            Pending Admin Approval
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {isAwaitingApproval && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800">
                        Awaiting admin review for publication
                      </div>
                    )}
                    
                    {isPublished && (
                      <Button
                        onClick={() => handleAssign(course.id)}
                        className="w-full text-sm"
                      >
                        Assign to Team
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
