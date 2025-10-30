import { TeamMember } from '../types';

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'EMPLOYEE',
    coursesEnrolled: 3,
    progress: 67,
    lastActive: '2025-10-29',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'EMPLOYEE',
    coursesEnrolled: 5,
    progress: 82,
    lastActive: '2025-10-30',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'EMPLOYEE',
    coursesEnrolled: 2,
    progress: 45,
    lastActive: '2025-10-28',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'EMPLOYEE',
    coursesEnrolled: 4,
    progress: 91,
    lastActive: '2025-10-30',
  },
];
