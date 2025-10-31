import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { updateEmployee, type Employee, type UpdateEmployeeData } from '../../services/employees';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSuccess: () => void;
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  onSuccess,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (employee) {
      setFirstName(employee.firstName || '');
      setLastName(employee.lastName || '');
      setJobTitle(employee.designation || '');
      setRole(employee.role || 'EMPLOYEE');
    }
  }, [employee]);

  const handleSave = async () => {
    if (!employee) return;

    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    setLoading(true);
    setError(null);

    const data: UpdateEmployeeData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      jobTitle: jobTitle.trim(),
      role,
    };

    try {
      await updateEmployee(employee.id, data);
      handleClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Employee"
      subtitle="Update employee details and role"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={employee?.email || ''}
            disabled
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <Input
            id="jobTitle"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Content Developer"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="TL">Team Lead</option>
            <option value="SRMGR">Senior Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 flex gap-3 justify-end">
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Modal>
  );
};
