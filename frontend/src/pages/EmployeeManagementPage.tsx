import React, { useState, useEffect, useCallback } from 'react';
import { authService } from '../auth/authService';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { InviteEmployeeModal } from '../components/modals/InviteEmployeeModal';
import { EditEmployeeModal } from '../components/modals/EditEmployeeModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { fetchEmployees, deleteEmployee, type Employee } from '../services/employees';

export const EmployeeManagementPage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEmployees(query);
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees(searchQuery || undefined);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, loadEmployees]);

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    loadEmployees(searchQuery || undefined);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;

    setDeleteLoading(true);
    try {
      await deleteEmployee(selectedEmployee.id);
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
      loadEmployees(searchQuery || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee');
      setDeleteDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error}</p>
              <Button onClick={() => loadEmployees(searchQuery || undefined)} variant="outline" size="sm">
                Retry
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((employee) => (
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
                      <p className="text-sm text-gray-600">{employee.designation || 'No job title'}</p>
                      <p className="text-xs text-gray-500 mt-1">{employee.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {employee.role}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(employee)}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(employee)}
                        className="flex-1 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {employees.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No employees found.</p>
              </div>
            )}
          </>
        )}
      </div>

      <InviteEmployeeModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />

      <EditEmployeeModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onSuccess={handleEditSuccess}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedEmployee(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};
