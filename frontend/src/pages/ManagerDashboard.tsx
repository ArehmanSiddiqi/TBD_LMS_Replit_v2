import React, { useState, useEffect } from 'react';
import { authService } from '../auth/authService';
import { assignmentsService, type Assignment } from '../services/assignments';
import { usersService, type User } from '../services/users';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';

interface TeamMemberStats {
  user: User;
  assignedCount: number;
  inProgressCount: number;
  completedCount: number;
  avgProgress: number;
  lastActivity: string;
}

export const ManagerDashboard: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teamStats, setTeamStats] = useState<TeamMemberStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [assignmentsData, teamMembers] = await Promise.all([
        assignmentsService.getTeamAssignments(),
        usersService.getTeamMembers(),
      ]);

      setAssignments(assignmentsData);
      
      const stats = teamMembers.map(user => {
        const userAssignments = assignmentsData.filter(a => a.user === user.id);
        const avgProgress = userAssignments.length > 0
          ? Math.round(userAssignments.reduce((sum, a) => sum + a.progress_pct, 0) / userAssignments.length)
          : 0;
        
        const lastActivityDates = userAssignments
          .map(a => a.last_activity_at)
          .filter(Boolean) as string[];
        
        const lastActivity = lastActivityDates.length > 0
          ? new Date(Math.max(...lastActivityDates.map(d => new Date(d).getTime()))).toLocaleDateString()
          : 'Never';

        return {
          user,
          assignedCount: userAssignments.length,
          inProgressCount: userAssignments.filter(a => a.status === 'in_progress').length,
          completedCount: userAssignments.filter(a => a.status === 'completed').length,
          avgProgress,
          lastActivity,
        };
      });

      setTeamStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const uniqueActiveLearners = new Set(
      assignments
        .filter(a => a.status !== 'not_started')
        .map(a => a.user)
    ).size;

    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(a => a.status === 'completed').length;
    const completionRate = totalAssignments > 0
      ? Math.round((completedAssignments / totalAssignments) * 100)
      : 0;

    const averageProgress = totalAssignments > 0
      ? Math.round(assignments.reduce((sum, a) => sum + a.progress_pct, 0) / totalAssignments)
      : 0;

    const uniqueCourses = new Set(assignments.map(a => a.course.id)).size;

    return {
      totalCourses: uniqueCourses,
      activeLearners: uniqueActiveLearners,
      completionRate,
      averageProgress,
    };
  };

  const metrics = calculateMetrics();

  const getUserName = (user: User) => {
    return `${user.first_name} ${user.last_name}`.trim() || user.email;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader currentUser={currentUser} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader currentUser={currentUser} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="text-3xl font-bold text-gray-900">{metrics.totalCourses}</div>
            <p className="text-xs text-gray-500 mt-1">Unique courses assigned</p>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Active Learners</div>
            <div className="text-3xl font-bold text-gray-900">{metrics.activeLearners}</div>
            <p className="text-xs text-gray-500 mt-1">Team members learning</p>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Completion Rate</div>
            <div className="text-3xl font-bold text-gray-900">{metrics.completionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {assignments.filter(a => a.status === 'completed').length} of {assignments.length} completed
            </p>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Avg Progress</div>
            <div className="text-3xl font-bold text-gray-900">{metrics.averageProgress}%</div>
            <p className="text-xs text-gray-500 mt-1">Across all assignments</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Overview</h2>
          {teamStats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No team members with assignments yet.</p>
            </div>
          ) : (
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
                      Assigned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      In Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamStats.map((member) => (
                    <tr key={member.user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getUserName(member.user)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {member.assignedCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          {member.inProgressCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {member.completedCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.avgProgress}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.lastActivity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
