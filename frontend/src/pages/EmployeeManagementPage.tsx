import React, { useState, useEffect, useCallback } from 'react';
import { authService } from '../auth/authService';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { InviteEmployeeModal } from '../components/modals/InviteEmployeeModal';
import { fetchEmployees, type Employee } from '../services/employees';

export const EmployeeManagementPage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
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
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                      {employee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.designation}</p>
                      <p className="text-xs text-gray-500 mt-1">{employee.email}</p>
                    </div>
                  </div>
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
    </div>
  );
};
