export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedCourses: number;
  inProgressCourses: number;
  completedCourses: number;
  assignedCourseIds?: string[];
}

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Ali Hassan',
    email: 'ali.hassan@example.com',
    role: 'Content Developer',
    assignedCourses: 2,
    inProgressCourses: 2,
    completedCourses: 1,
    assignedCourseIds: ['1', '3'],
  },
  {
    id: '2',
    name: 'Sara Ahmed',
    email: 'sara.ahmed@example.com',
    role: 'UI/UX Designer',
    assignedCourses: 3,
    inProgressCourses: 2,
    completedCourses: 1,
    assignedCourseIds: ['1', '2'],
  },
  {
    id: '3',
    name: 'Omar Khan',
    email: 'omar.khan@example.com',
    role: 'Frontend Developer',
    assignedCourses: 4,
    inProgressCourses: 3,
    completedCourses: 2,
    assignedCourseIds: ['2', '3', '4'],
  },
  {
    id: '4',
    name: 'Fatima Malik',
    email: 'fatima.malik@example.com',
    role: 'Product Manager',
    assignedCourses: 2,
    inProgressCourses: 1,
    completedCourses: 1,
    assignedCourseIds: ['1'],
  },
  {
    id: '5',
    name: 'Hassan Ali',
    email: 'hassan.ali@example.com',
    role: 'Backend Developer',
    assignedCourses: 3,
    inProgressCourses: 2,
    completedCourses: 2,
    assignedCourseIds: ['2', '4'],
  },
  {
    id: '6',
    name: 'Ayesha Siddiqui',
    email: 'ayesha.siddiqui@example.com',
    role: 'QA Engineer',
    assignedCourses: 2,
    inProgressCourses: 1,
    completedCourses: 1,
    assignedCourseIds: [],
  },
];
