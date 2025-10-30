import React, { useState } from 'react';
import { authService } from '../auth/authService';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CourseApprovalModal } from '../components/modals/CourseApprovalModal';
import { mockAdminStats, mockCoursesWithStatus, mockInactiveUsers } from '../mocks/adminData';
import type { CourseWithStatus } from '../mocks/adminData';

export const AdminDashboard: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const [selectedCourse, setSelectedCourse] = useState<CourseWithStatus | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [courses, setCourses] = useState(mockCoursesWithStatus);

  const handleApproveClick = (course: CourseWithStatus) => {
    setSelectedCourse(course);
    setApprovalModalOpen(true);
  };

  const handleApprove = () => {
    if (selectedCourse) {
      setCourses(courses.map(c => 
        c.id === selectedCourse.id 
          ? { ...c, status: 'published' as const }
          : c
      ));
      setApprovalModalOpen(false);
      setSelectedCourse(null);
    }
  };

  const handleReject = (note: string) => {
    if (selectedCourse) {
      setCourses(courses.map(c => 
        c.id === selectedCourse.id 
          ? { ...c, status: 'needs_revision' as const, managerNote: note }
          : c
      ));
      setApprovalModalOpen(false);
      setSelectedCourse(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform overview and course management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Total Assigned</div>
            <div className="text-3xl font-bold text-gray-900">{mockAdminStats.totalAssigned}</div>
          </Card>
          
          <Card className="p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Started</div>
            <div className="text-3xl font-bold text-blue-600">{mockAdminStats.started}</div>
          </Card>
          
          <Card className="p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Completed</div>
            <div className="text-3xl font-bold text-green-600">{mockAdminStats.completed}</div>
          </Card>
          
          <Card className="p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Active (7d)</div>
            <div className="text-3xl font-bold text-purple-600">{mockAdminStats.activeUsers7d}</div>
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">All Courses</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course Title</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Creator</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="relative group">
                        <div className="font-medium text-gray-900 cursor-pointer">{course.title}</div>
                        <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 z-10 whitespace-nowrap">
                          Last updated: {course.lastUpdated} | Created by: {course.creatorName}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">Updated: {course.lastUpdated}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{course.creatorName}</td>
                    <td className="py-3 px-4">{getStatusBadge(course.status)}</td>
                    <td className="py-3 px-4">
                      {course.status === 'draft' && (
                        <Button
                          onClick={() => handleApproveClick(course)}
                          className="text-sm px-4 py-1"
                        >
                          Approve
                        </Button>
                      )}
                      {course.status === 'needs_revision' && (
                        <Button
                          onClick={() => handleApproveClick(course)}
                          variant="secondary"
                          className="text-sm px-4 py-1"
                        >
                          Review
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Inactive Users (30+ days)</h3>
            {mockInactiveUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-gray-600">All users are active!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockInactiveUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="text-sm text-gray-500">{user.daysSinceActive}d ago</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completion Rate</span>
                <span className="text-2xl font-bold text-blue-600">{mockAdminStats.completionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Courses</span>
                <span className="text-2xl font-bold text-green-600">{mockAdminStats.activeCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="text-2xl font-bold text-purple-600">{mockAdminStats.totalUsers}</span>
              </div>
            </div>
          </Card>
        </div>
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
