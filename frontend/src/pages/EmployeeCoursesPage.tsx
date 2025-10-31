import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { coursesService, type Course } from '../services/courses';
import { assignmentsService, type Assignment } from '../services/assignments';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface EmployeeCoursesPageProps {
  currentUser: User | null;
}

type TabType = 'my-courses' | 'all-courses';

export const EmployeeCoursesPage: React.FC<EmployeeCoursesPageProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('my-courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [coursesData, assignmentsData] = await Promise.all([
        coursesService.getAll(),
        assignmentsService.getMyAssignments(),
      ]);
      
      setAllCourses(coursesData.filter(c => c.status === 'published'));
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const myCoursesFiltered = assignments.filter(assignment =>
    assignment.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allCoursesFiltered = allCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAssignmentForCourse = (courseId: number): Assignment | undefined => {
    return assignments.find(a => a.course.id === courseId);
  };

  const getLearningStatusBadge = (assignment?: Assignment) => {
    if (!assignment) {
      return <span className="bg-gray-400 text-white text-xs font-medium px-3 py-1 rounded">Not Assigned</span>;
    }
    if (assignment.status === 'completed') {
      return <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded">Completed</span>;
    }
    if (assignment.status === 'in_progress') {
      return <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded">In Progress</span>;
    }
    return <span className="bg-gray-400 text-white text-xs font-medium px-3 py-1 rounded">Not Started</span>;
  };

  const getButtonText = (assignment?: Assignment) => {
    if (!assignment) return 'View Course';
    if (assignment.status === 'completed') return 'Review';
    if (assignment.status === 'in_progress') return 'Continue';
    return 'Start Course';
  };

  const renderMyCourses = () => {
    if (myCoursesFiltered.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {searchQuery ? 'No assigned courses found matching your search.' : 'No courses assigned yet. Check the "All Courses" tab to explore available courses.'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCoursesFiltered.map((assignment) => (
          <Card key={assignment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={assignment.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                alt={assignment.course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                {getLearningStatusBadge(assignment)}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {assignment.course.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {assignment.course.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{assignment.course.duration || 'Self-paced'}</span>
                <span className="font-medium capitalize">{assignment.course.level || 'Beginner'}</span>
              </div>

              {assignment.status !== 'not_started' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs font-semibold text-gray-900">{assignment.progress_pct}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${assignment.progress_pct}%` }}
                    />
                  </div>
                </div>
              )}
              
              <Button
                onClick={() => navigate(`/courses/${assignment.course.id}`)}
                className="w-full"
              >
                {getButtonText(assignment)}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderAllCourses = () => {
    if (allCoursesFiltered.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {searchQuery ? 'No courses found matching your search.' : 'No published courses available.'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCoursesFiltered.map((course) => {
          const assignment = getAssignmentForCourse(course.id);
          
          return (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  {getLearningStatusBadge(assignment)}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{course.duration || 'Self-paced'}</span>
                  <span className="font-medium capitalize">{course.level || 'Beginner'}</span>
                </div>

                {assignment && assignment.status !== 'not_started' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs font-semibold text-gray-900">{assignment.progress_pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${assignment.progress_pct}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="w-full"
                >
                  {getButtonText(assignment)}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-2">Explore and learn from our course library</p>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('my-courses')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'my-courses'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Courses ({assignments.length})
            </button>
            <button
              onClick={() => setActiveTab('all-courses')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'all-courses'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Courses ({allCourses.length})
            </button>
          </nav>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder={`Search ${activeTab === 'my-courses' ? 'my' : 'all'} courses...`}
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
            {activeTab === 'my-courses' && renderMyCourses()}
            {activeTab === 'all-courses' && renderAllCourses()}
          </>
        )}
      </div>
    </div>
  );
};
