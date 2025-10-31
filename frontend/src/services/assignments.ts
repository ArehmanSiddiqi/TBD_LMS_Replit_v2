import { api } from './api';

export type Assignment = {
  id: number;
  user: number;
  user_name: string;
  course: {
    id: number;
    title: string;
    description: string;
    thumbnail_url: string;
    video_url: string;
    status: string;
    level: string;
    duration: string;
    duration_minutes?: number;
    created_by_name: string;
    updated_at: string;
  };
  course_title: string;
  assigned_by: number;
  assigned_by_name: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_pct: number;
  last_activity_at: string | null;
  assigned_at: string;
  completed_at: string | null;
};

export type CreateAssignmentData = {
  course_id: number;
  user_id?: number;
};

export type UpdateProgressData = {
  progress_pct: number;
  status?: 'not_started' | 'in_progress' | 'completed';
};

class AssignmentsService {
  async getMyAssignments(): Promise<Assignment[]> {
    return api.get<Assignment[]>('/assignments/mine/');
  }

  async getTeamAssignments(): Promise<Assignment[]> {
    return api.get<Assignment[]>('/assignments/team/');
  }

  async createAssignment(data: CreateAssignmentData): Promise<Assignment> {
    return api.post<Assignment>('/assignments/', data);
  }

  async updateProgress(assignmentId: number, data: UpdateProgressData): Promise<Assignment> {
    return api.patch<Assignment>(`/assignments/${assignmentId}/progress/`, data);
  }

  async getAssignment(assignmentId: number): Promise<Assignment> {
    return api.get<Assignment>(`/assignments/${assignmentId}/`);
  }
}

export const assignmentsService = new AssignmentsService();
