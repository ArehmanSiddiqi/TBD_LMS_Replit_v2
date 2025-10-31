import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { usersService, type User } from '../../services/users';
import { assignmentsService, type Assignment } from '../../services/assignments';

interface AssignCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  courseTitle: string;
}

export const AssignCourseModal: React.FC<AssignCourseModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [usersData, assignmentsData] = await Promise.all([
        usersService.search(),
        assignmentsService.getTeamAssignments(),
      ]);
      
      setEmployees(usersData.filter(u => u.role === 'EMPLOYEE'));
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEmployee = (employeeId: number) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId);
    } else {
      newSelected.add(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  const handleAssign = async () => {
    if (selectedEmployees.size === 0) return;

    try {
      setAssigning(true);
      setError('');

      await Promise.all(
        Array.from(selectedEmployees).map(userId =>
          assignmentsService.createAssignment({
            course_id: courseId,
            user_id: userId,
          })
        )
      );

      alert(`Successfully assigned course to ${selectedEmployees.size} employee(s)!`);
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign course');
    } finally {
      setAssigning(false);
    }
  };

  const handleCancel = () => {
    setSelectedEmployees(new Set());
    setError('');
    onClose();
  };

  const isAlreadyAssigned = (userId: number) => {
    return assignments.some(a => a.user === userId && a.course.id === courseId);
  };

  const getEmployeeName = (employee: User) => {
    return `${employee.first_name} ${employee.last_name}`.trim() || employee.email;
  };

  const getInitials = (employee: User) => {
    const name = getEmployeeName(employee);
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Assign Course to Employees"
      subtitle="Select employees to assign this course to."
    >
      <div className="mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Course:</span> {courseTitle}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading employees...</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
            {employees.map((employee) => {
              const alreadyAssigned = isAlreadyAssigned(employee.id);
              const isDisabled = alreadyAssigned;

              return (
                <label
                  key={employee.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isDisabled
                      ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                      : 'bg-white border-gray-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50'
                  } transition-colors`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.has(employee.id)}
                      onChange={() => !isDisabled && handleToggleEmployee(employee.id)}
                      disabled={isDisabled}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {getInitials(employee)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{getEmployeeName(employee)}</p>
                      <p className="text-sm text-gray-600">{employee.job_title || employee.email}</p>
                    </div>
                  </div>
                  {alreadyAssigned && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                      Already assigned
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {employees.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No employees found.</p>
            </div>
          )}
        </>
      )}

      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {selectedEmployees.size} employee(s) selected
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleCancel} disabled={assigning}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedEmployees.size === 0 || assigning}
          >
            {assigning ? 'Assigning...' : `Assign to ${selectedEmployees.size} Employee(s)`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
