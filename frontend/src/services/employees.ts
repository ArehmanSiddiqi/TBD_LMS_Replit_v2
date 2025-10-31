import { api } from './api';

export interface Employee {
  id: number;
  name: string;
  email: string;
  designation: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UpdateEmployeeData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  role: string;
}

export async function fetchEmployees(searchQuery?: string): Promise<Employee[]> {
  const endpoint = searchQuery ? `/employees/?q=${encodeURIComponent(searchQuery)}` : '/employees/';
  return api.get<Employee[]>(endpoint);
}

export async function updateEmployee(id: number, data: UpdateEmployeeData): Promise<Employee> {
  return api.patch<Employee>(`/employees/${id}/`, data);
}

export async function deleteEmployee(id: number): Promise<void> {
  return api.delete<void>(`/employees/${id}/delete/`);
}
