import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { mockEmployees } from '../../mocks/employees';
import type { Employee } from '../../mocks/employees';

interface AssignCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
}

export const AssignCourseModal: React.FC<AssignCourseModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}) => {
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());

  const handleToggleEmployee = (employeeId: string) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId);
    } else {
      newSelected.add(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  const handleAssign = () => {
    onClose();
    setSelectedEmployees(new Set());
  };

  const handleCancel = () => {
    onClose();
    setSelectedEmployees(new Set());
  };

  const isAlreadyAssigned = (employee: Employee) => {
    return employee.assignedCourseIds?.includes(courseId) || false;
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

      <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
        {mockEmployees.map((employee) => {
          const alreadyAssigned = isAlreadyAssigned(employee);
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
                  {employee.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{employee.name}</p>
                  <p className="text-sm text-gray-600">{employee.role}</p>
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

      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {selectedEmployees.size} employee(s) selected
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedEmployees.size === 0}
          >
            Assign to {selectedEmployees.size} Employee(s)
          </Button>
        </div>
      </div>
    </Modal>
  );
};
