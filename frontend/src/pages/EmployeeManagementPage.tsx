import React, { useState } from 'react';
import { authService } from '../auth/authService';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { InviteEmployeeModal } from '../components/modals/InviteEmployeeModal';
import { mockEmployees } from '../mocks/employees';

export const EmployeeManagementPage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const filteredEmployees = mockEmployees.filter((employee) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      employee.name.toLowerCase().includes(query) ||
      employee.role.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-600 mt-1">View all employees and send invitations</p>
          </div>
          <Button onClick={() => setInviteModalOpen(true)}>
            Invite Employee
          </Button>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                  {employee.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{employee.name}</h3>
                  <p className="text-sm text-gray-600">{employee.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{employee.email}</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-300">
                  {employee.assignedCourses} assigned
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-300">
                  {employee.inProgressCourses} in progress
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-300">
                  {employee.completedCourses} completed
                </span>
              </div>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No employees found matching your search.</p>
          </div>
        )}
      </div>

      <InviteEmployeeModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
    </div>
  );
};
