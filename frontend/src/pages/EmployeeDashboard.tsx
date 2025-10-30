import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';

interface CourseData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  progress?: number;
  state: 'completed' | 'in-progress' | 'not-started';
}

const myCourses: CourseData[] = [
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    description: 'Create beautiful and user-friendly interfaces.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    progress: 100,
    state: 'completed',
  },
  {
    id: '1',
    title: 'Introduction to Data Analysis',
    description: 'Learn the fundamentals of data analysis and interpretation.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    progress: 45,
    state: 'in-progress',
  },
];

const allCourses: CourseData[] = [
  ...myCourses,
  {
    id: '2',
    title: 'Advanced JavaScript Patterns',
    description: 'Master modern JavaScript design patterns and best practices.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
    state: 'not-started',
  },
];

export const EmployeeDashboard: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [searchQuery, setSearchQuery] = useState('');

  const courses = activeTab === 'my' ? myCourses : allCourses;

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const query = searchQuery.toLowerCase();
    return courses.filter(
      course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query)
    );
  }, [courses, searchQuery]);

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
              AH
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Ali Hassan</h2>
              <p className="text-sm text-gray-600">Content Developer</p>
              <p className="text-sm text-gray-500">ali.hassan@example.com</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-xs text-gray-600 mt-1">Assigned Courses</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-xs text-gray-600 mt-1">In Progress</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">1</div>
              <div className="text-xs text-gray-600 mt-1">Completed</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">99%</div>
              <div className="text-xs text-gray-600 mt-1">Overall Progress</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('my')}
                className={`pb-3 px-1 font-medium text-sm transition-colors relative ${
                  activeTab === 'my'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Courses (2)
                {activeTab === 'my' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-3 px-1 font-medium text-sm transition-colors relative ${
                  activeTab === 'all'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Courses (3)
                {activeTab === 'all' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search all courses…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                {course.state === 'completed' && (
                  <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded">
                    Completed
                  </div>
                )}
                {course.state === 'not-started' && (
                  <div className="absolute top-3 right-3 bg-gray-400 text-white text-xs font-medium px-3 py-1 rounded">
                    Browse
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                {course.state !== 'not-started' && course.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs font-semibold text-gray-900">{course.progress}%</span>
                    </div>
                    <ProgressBar progress={course.progress} />
                  </div>
                )}
                
                <Button
                  onClick={() => handleCourseClick(course.id)}
                  className="w-full"
                >
                  {course.state === 'not-started' ? 'Start Course' : 'Continue'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
