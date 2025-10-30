import React from 'react';
import { authService } from '../auth/authService';
import { mockManagerStats } from '../mocks/dashboardStats';
import { mockTeamMembers } from '../mocks/teamMembers';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';

export const ManagerDashboard: React.FC = () => {
  const currentUser = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor team performance and course metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-sm text-gray-600 mb-1">Total Courses</div>
            <div className="text-3xl font-bold text-gray-900">{mockManagerStats.totalCourses}</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Active Learners</div>
            <div className="text-3xl font-bold text-gray-900">{mockManagerStats.activeLearners}</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Completion Rate</div>
            <div className="text-3xl font-bold text-gray-900">{mockManagerStats.completionRate}%</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Avg Progress</div>
            <div className="text-3xl font-bold text-gray-900">{mockManagerStats.averageProgress}%</div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Overview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockTeamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.coursesEnrolled}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.progress}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.lastActive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
