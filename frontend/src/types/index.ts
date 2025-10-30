export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface User {
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export type CourseStatus = 'draft' | 'published' | 'awaiting_approval' | 'needs_revision';
export type LearningStatus = 'not_started' | 'in_progress' | 'completed';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  createdBy: string;
  status: 'draft' | 'published';
  progress?: number;
  assignedBy?: string;
  level?: string;
  courseStatus?: CourseStatus;
  learningStatus?: LearningStatus;
}

export interface CourseDetail extends Course {
  createdAt: string;
  updatedAt: string;
  milestones: Milestone[];
  lastActivity?: string;
}

export interface Milestone {
  percentage: number;
  completed: boolean;
  completedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  coursesEnrolled: number;
  progress: number;
  lastActive: string;
}

export interface DashboardStats {
  totalCourses: number;
  activeLearners: number;
  completionRate: number;
  averageProgress: number;
}
