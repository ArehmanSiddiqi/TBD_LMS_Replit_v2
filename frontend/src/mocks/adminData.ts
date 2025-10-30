export interface AdminStats {
  totalAssigned: number;
  started: number;
  completed: number;
  activeUsers7d: number;
  completionRate: number;
  activeCourses: number;
  totalUsers: number;
}

export interface CourseWithStatus {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  level: string;
  creatorName: string;
  status: 'published' | 'draft' | 'needs_revision';
  lastUpdated: string;
  managerNote?: string;
}

export interface InactiveUser {
  id: string;
  name: string;
  email: string;
  lastActive: string;
  daysSinceActive: number;
}

export const mockAdminStats: AdminStats = {
  totalAssigned: 8,
  started: 5,
  completed: 3,
  activeUsers7d: 8,
  completionRate: 38,
  activeCourses: 3,
  totalUsers: 8,
};

export const mockCoursesWithStatus: CourseWithStatus[] = [
  {
    id: '1',
    title: 'Introduction to Data Analysis',
    description: 'Learn the fundamentals of data analysis using Python and popular libraries',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '4 hours',
    level: 'Beginner',
    creatorName: 'Sarah Johnson',
    status: 'published',
    lastUpdated: '2024-10-25',
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    description: 'Master advanced React patterns including hooks, context, and performance optimization',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '6 hours',
    level: 'Advanced',
    creatorName: 'Michael Chen',
    status: 'published',
    lastUpdated: '2024-10-28',
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the core principles of user interface and user experience design',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '5 hours',
    level: 'Beginner',
    creatorName: 'Emily Parker',
    status: 'draft',
    lastUpdated: '2024-10-29',
    managerNote: 'This course covers essential design principles for modern web applications. Ready for review.',
  },
  {
    id: '4',
    title: 'Machine Learning Basics',
    description: 'Get started with machine learning algorithms and practical applications',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '8 hours',
    level: 'Intermediate',
    creatorName: 'David Martinez',
    status: 'published',
    lastUpdated: '2024-10-20',
  },
  {
    id: '5',
    title: 'Agile Project Management',
    description: 'Master agile methodologies and become an effective project manager',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '3 hours',
    level: 'Intermediate',
    creatorName: 'Lisa Wong',
    status: 'draft',
    lastUpdated: '2024-10-30',
    managerNote: 'Comprehensive guide to Agile and Scrum. Includes case studies and practical examples.',
  },
];

export const mockInactiveUsers: InactiveUser[] = [];
