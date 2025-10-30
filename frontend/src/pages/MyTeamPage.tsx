import React, { useState } from 'react';
import { authService } from '../auth/authService';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AssignCourseModal } from '../components/modals/AssignCourseModal';
import { mockEmployees } from '../mocks/employees';

export const MyTeamPage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{ id: string; title: string } | null>(null);

  const filteredEmployees = mockEmployees.filter((employee) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      employee.name.toLowerCase().includes(query) ||
      employee.role.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query)
    );
  });

  const handleAssignClick = () => {
    setSelectedCourse({ id: '1', title: 'Introduction to Data Analysis' });
    setAssignModalOpen(true);
  };

  const handleAddTeamMember = () => {
    alert('Add Team Member functionality - placeholder');
  };

  const handleViewProgress = (employeeId: string) => {
    alert(`View Progress for employee ${employeeId} - placeholder`);
  };

  const handleViewProfile = (employeeId: string) => {
    alert(`View Profile for employee ${employeeId} - placeholder`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Team</h1>
            <p className="text-gray-600 mt-1">Manage your team members and their courses</p>
          </div>
          <Button onClick={handleAddTeamMember}>
            Add Team Member
          </Button>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search team members..."
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
                </div>
              </div>

              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {employee.assignedCourses} assigned
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {employee.completedCourses} completed
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleAssignClick}
                  className="w-full text-sm"
                >
                  Assign
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleViewProgress(employee.id)}
                  className="w-full text-sm"
                >
                  Progress
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleViewProfile(employee.id)}
                  className="w-full text-sm"
                >
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No team members found matching your search.</p>
          </div>
        )}
      </div>

      {selectedCourse && (
        <AssignCourseModal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          courseId={selectedCourse.id}
          courseTitle={selectedCourse.title}
        />
      )}
    </div>
  );
};
