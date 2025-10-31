import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

interface Assignment {
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
}

interface CreateAssignmentData {
  course_id: number;
  user_id?: number;
}

interface UpdateProgressData {
  progress_pct: number;
  status?: 'not_started' | 'in_progress' | 'completed';
}

class AssignmentsService {
  private getAuthHeader() {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getMyAssignments(): Promise<Assignment[]> {
    const response = await axios.get(`${API_BASE_URL}/assignments/mine/`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async getTeamAssignments(): Promise<Assignment[]> {
    const response = await axios.get(`${API_BASE_URL}/assignments/team/`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async createAssignment(data: CreateAssignmentData): Promise<Assignment> {
    const response = await axios.post(`${API_BASE_URL}/assignments/`, data, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async updateProgress(assignmentId: number, data: UpdateProgressData): Promise<Assignment> {
    const response = await axios.patch(
      `${API_BASE_URL}/assignments/${assignmentId}/progress/`,
      data,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data;
  }

  async getAssignment(assignmentId: number): Promise<Assignment> {
    const response = await axios.get(`${API_BASE_URL}/assignments/${assignmentId}/`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }
}

export const assignmentsService = new AssignmentsService();
export type { Assignment, CreateAssignmentData, UpdateProgressData };
