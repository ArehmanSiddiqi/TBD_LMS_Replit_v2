import { api } from './api';

export interface Employee {
  id: number;
  name: string;
  email: string;
  designation: string;
}

export async function fetchEmployees(searchQuery?: string): Promise<Employee[]> {
  const endpoint = searchQuery ? `/employees/?q=${encodeURIComponent(searchQuery)}` : '/employees/';
  return api.get<Employee[]>(endpoint);
}
