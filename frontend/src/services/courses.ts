import { api } from './api';

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  status: 'draft' | 'published' | 'needs_revision' | 'awaiting_approval';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  created_by: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  thumbnail_url?: string;
  video_url?: string;
  status?: string;
  level?: string;
  duration?: string;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  id: number;
}

export const coursesService = {
  async getAll(): Promise<Course[]> {
    return api.get<Course[]>('/courses/');
  },

  async getById(id: number): Promise<Course> {
    return api.get<Course>(`/courses/${id}/`);
  },

  async create(data: CreateCourseData): Promise<Course> {
    return api.post<Course>('/courses/', data);
  },

  async update(id: number, data: Partial<CreateCourseData>): Promise<Course> {
    return api.patch<Course>(`/courses/${id}/`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/courses/${id}/`);
  },

  async publish(id: number): Promise<Course> {
    return api.patch<Course>(`/courses/${id}/publish/`);
  },

  async unpublish(id: number): Promise<Course> {
    return api.patch<Course>(`/courses/${id}/unpublish/`);
  },

  async reject(id: number, note: string): Promise<Course> {
    return api.post<Course>(`/courses/${id}/reject/`, { note });
  },
};
