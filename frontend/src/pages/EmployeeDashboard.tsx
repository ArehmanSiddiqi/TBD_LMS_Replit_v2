import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { coursesService } from '../services/courses';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';

interface CourseData {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  status: string;
  progress?: number;
  state?: 'completed' | 'in-progress' | 'not-started';
}

export const EmployeeDashboard: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await coursesService.getCourses();
        const publishedCourses = data.filter(course => course.status === 'published');
        setCourses(publishedCourses);
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // TODO: Once assignments/progress tracking is implemented, filter myCourses based on actual assignments
  // For now, show all published courses in both tabs
  const myCourses = courses;
  const displayCourses = activeTab === 'my' ? myCourses : courses;

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return displayCourses;
    const query = searchQuery.toLowerCase();
    return displayCourses.filter(
      course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query)
    );
  }, [displayCourses, searchQuery]);

  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader currentUser={currentUser} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader currentUser={currentUser} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
                My Courses ({myCourses.length})
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
                All Courses ({courses.length})
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
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                {course.state === 'completed' && (
                  <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded">
                    Completed
                  </div>
                )}
                {(!course.state || course.state === 'not-started') && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded">
                    Available
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
                
                {course.state && course.state !== 'not-started' && course.progress !== undefined && (
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
                  {(!course.state || course.state === 'not-started') ? 'Start Course' : 'Continue'}
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
