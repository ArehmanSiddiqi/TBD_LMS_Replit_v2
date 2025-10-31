import { api } from './api';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
  job_title: string;
}

export interface TeamMemberAddData {
  user_id: number;
}

class UsersService {
  async search(query?: string): Promise<User[]> {
    const endpoint = query ? `/users/search/?q=${encodeURIComponent(query)}` : '/users/search/';
    return api.get<User[]>(endpoint);
  }

  async getTeamMembers(): Promise<User[]> {
    return api.get<User[]>('/team/members/');
  }

  async addTeamMember(data: TeamMemberAddData): Promise<void> {
    return api.post<void>('/team/add_member/', data);
  }
}

export const usersService = new UsersService();
