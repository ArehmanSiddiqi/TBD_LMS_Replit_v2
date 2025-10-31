import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { assignmentsService, Assignment } from '../services/assignments';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';

export const EmployeeDashboard: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await assignmentsService.getMyAssignments();
        setAssignments(data);
      } catch (err: any) {
        console.error('Error fetching assignments:', err);
        setError(err.message || 'Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAssignments = useMemo(() => {
    if (!searchQuery.trim()) return assignments;
    const query = searchQuery.toLowerCase();
    return assignments.filter(
      assignment =>
        assignment.course.title.toLowerCase().includes(query) ||
        assignment.course.description.toLowerCase().includes(query)
    );
  }, [assignments, searchQuery]);

  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}`);
  };

  // Calculate stats
  const totalAssigned = assignments.length;
  const inProgress = assignments.filter(a => a.status === 'in_progress').length;
  const completed = assignments.filter(a => a.status === 'completed').length;
  const avgProgress = totalAssigned > 0
    ? Math.round(assignments.reduce((sum, a) => sum + a.progress_pct, 0) / totalAssigned)
    : 0;

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
              <div className="text-2xl font-bold text-gray-900">{totalAssigned}</div>
              <div className="text-xs text-gray-600 mt-1">Assigned Courses</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{inProgress}</div>
              <div className="text-xs text-gray-600 mt-1">In Progress</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{completed}</div>
              <div className="text-xs text-gray-600 mt-1">Completed</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{avgProgress}%</div>
              <div className="text-xs text-gray-600 mt-1">Overall Progress</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Assigned Courses</h2>
          <input
            type="text"
            placeholder="Search your courses…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={assignment.course.thumbnail_url}
                  alt={assignment.course.title}
                  className="w-full h-48 object-cover"
                />
                {assignment.status === 'completed' && (
                  <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded">
                    Completed
                  </div>
                )}
                {assignment.status === 'in_progress' && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded">
                    In Progress
                  </div>
                )}
                {assignment.status === 'not_started' && (
                  <div className="absolute top-3 right-3 bg-gray-400 text-white text-xs font-medium px-3 py-1 rounded">
                    Not Started
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {assignment.course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {assignment.course.description}
                </p>
                
                {assignment.status !== 'not_started' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs font-semibold text-gray-900">{assignment.progress_pct}%</span>
                    </div>
                    <ProgressBar progress={assignment.progress_pct} />
                  </div>
                )}
                
                <Button
                  onClick={() => handleCourseClick(assignment.course.id)}
                  className="w-full"
                >
                  {assignment.status === 'not_started' ? 'Start Course' : 'Continue'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredAssignments.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery ? 'No courses found matching your search.' : 'No courses assigned yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
