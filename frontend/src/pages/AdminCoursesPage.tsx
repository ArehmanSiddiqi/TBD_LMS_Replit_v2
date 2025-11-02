import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CourseApprovalModal } from '../components/modals/CourseApprovalModal';
import { coursesService, type Course } from '../services/courses';

export const AdminCoursesPage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'needs_revision'>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
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
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.created_by_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveClick = (course: Course) => {
    setSelectedCourse(course);
    setApprovalModalOpen(true);
  };

  const handleApprove = async () => {
    if (selectedCourse) {
      try {
        await coursesService.update(selectedCourse.id, { status: 'published' });
        await loadCourses();
        setApprovalModalOpen(false);
        setSelectedCourse(null);
      } catch (err) {
        setError('Failed to approve course');
      }
    }
  };

  const handleReject = async (note: string) => {
    if (selectedCourse) {
      try {
        // Use the dedicated reject endpoint so manager notes are preserved
        await coursesService.reject(selectedCourse.id, note);
        await loadCourses();
        setApprovalModalOpen(false);
        setSelectedCourse(null);
      } catch (err) {
        setError('Failed to reject course');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      needs_revision: 'bg-yellow-100 text-yellow-800',
    };
    const labels = {
      published: 'Published',
      draft: 'Draft',
      needs_revision: 'Needs Revision',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-2">Review and approve courses for publishing</p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="needs_revision">Needs Revision</option>
            </select>
          </div>
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
                  <img
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="relative group flex-1">
                        <h3 className="font-bold text-lg text-gray-900 cursor-pointer">{course.title}</h3>
                        <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 z-10 whitespace-nowrap">
                          Last updated: {new Date(course.updated_at).toLocaleDateString()} | Created by: {course.created_by_name}
                        </div>
                      </div>
                      {getStatusBadge(course.status)}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Creator</span>
                        <span className="font-medium text-gray-900">{course.created_by_name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Level</span>
                        <span className="font-medium text-gray-900 capitalize">{course.level}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Updated</span>
                        <span className="font-medium text-gray-900">{new Date(course.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    variant="secondary"
                    className="flex-1 text-sm"
                  >
                    View
                  </Button>
                  {course.status === 'draft' && (
                    <Button
                      onClick={() => handleApproveClick(course)}
                      className="flex-1 text-sm"
                    >
                      Approve
                    </Button>
                  )}
                  {course.status === 'needs_revision' && (
                    <Button
                      onClick={() => handleApproveClick(course)}
                      variant="secondary"
                      className="flex-1 text-sm"
                    >
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

            {filteredCourses.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No courses found</p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedCourse && (
        <CourseApprovalModal
          isOpen={approvalModalOpen}
          onClose={() => {
            setApprovalModalOpen(false);
            setSelectedCourse(null);
          }}
          course={selectedCourse}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};
