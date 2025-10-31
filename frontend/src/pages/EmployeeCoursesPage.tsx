import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { coursesService, type Course } from '../services/courses';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface EmployeeCoursesPageProps {
  currentUser: User | null;
}

export const EmployeeCoursesPage: React.FC<EmployeeCoursesPageProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await coursesService.getAll();
      setCourses(data.filter(c => c.status === 'published'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
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

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading courses...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      {getLearningStatusBadge(undefined, undefined)}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="relative group mb-3">
                      <h3 className="text-xl font-bold text-gray-900 cursor-pointer">
                        {course.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{course.duration || 'Self-paced'}</span>
                      <span className="font-medium capitalize">{course.level || 'Beginner'}</span>
                    </div>
                    
                    <Button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="w-full"
                    >
                      {getButtonText(undefined)}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {filteredCourses.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600">No courses found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
