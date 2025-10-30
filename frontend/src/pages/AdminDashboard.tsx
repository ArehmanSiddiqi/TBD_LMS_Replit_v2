import React from 'react';
import { authService } from '../auth/authService';
import { mockAdminStats } from '../mocks/dashboardStats';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';

export const AdminDashboard: React.FC = () => {
  const currentUser = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System-wide metrics and analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-sm text-gray-600 mb-1">Total Courses</div>
            <div className="text-3xl font-bold text-gray-900">{mockAdminStats.totalCourses}</div>
            <div className="text-xs text-green-600 mt-2">+12% from last month</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Active Learners</div>
            <div className="text-3xl font-bold text-gray-900">{mockAdminStats.activeLearners}</div>
            <div className="text-xs text-green-600 mt-2">+8% from last month</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Completion Rate</div>
            <div className="text-3xl font-bold text-gray-900">{mockAdminStats.completionRate}%</div>
            <div className="text-xs text-green-600 mt-2">+5% from last month</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Avg Progress</div>
            <div className="text-3xl font-bold text-gray-900">{mockAdminStats.averageProgress}%</div>
            <div className="text-xs text-red-600 mt-2">-2% from last month</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Server Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Database</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Healthy
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Storage</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  78% Used
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="text-gray-900 font-medium">New course published</p>
                <p className="text-gray-500">Advanced React Patterns - 2 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-900 font-medium">User registered</p>
                <p className="text-gray-500">jane.doe@example.com - 3 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-900 font-medium">Course completed</p>
                <p className="text-gray-500">Python Basics by john.smith - 5 hours ago</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
