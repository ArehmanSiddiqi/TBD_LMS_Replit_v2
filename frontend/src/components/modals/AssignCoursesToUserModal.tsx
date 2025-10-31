import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { coursesService, type Course } from '../../services/courses';
import { assignmentsService } from '../../services/assignments';

interface AssignCoursesToUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  existingCourseIds?: number[];
}

export const AssignCoursesToUserModal: React.FC<AssignCoursesToUserModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  existingCourseIds = [],
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCourses();
    }
  }, [isOpen]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await coursesService.getAll();
      setCourses(data.filter(c => c.status === 'published'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCourse = (courseId: number) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
    } else {
      newSelected.add(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const handleAssign = async () => {
    if (selectedCourses.size === 0) return;

    try {
      setAssigning(true);
      setError('');

      await Promise.all(
        Array.from(selectedCourses).map(courseId =>
          assignmentsService.createAssignment({
            course_id: courseId,
            user_id: userId,
          })
        )
      );

      alert(`Successfully assigned ${selectedCourses.size} course(s) to ${userName}!`);
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign courses');
    } finally {
      setAssigning(false);
    }
  };

  const handleCancel = () => {
    setSelectedCourses(new Set());
    setError('');
    onClose();
  };

  const isAlreadyAssigned = (courseId: number) => {
    return existingCourseIds.includes(courseId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Assign Courses to Employee"
      subtitle={`Select courses to assign to ${userName}`}
    >
      <div className="mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Employee:</span> {userName}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading courses...</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
            {courses.map((course) => {
              const alreadyAssigned = isAlreadyAssigned(course.id);
              const isDisabled = alreadyAssigned;

              return (
                <label
                  key={course.id}
                  className={`flex items-start justify-between p-4 rounded-lg border ${
                    isDisabled
                      ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                      : 'bg-white border-gray-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50'
                  } transition-colors`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedCourses.has(course.id)}
                      onChange={() => !isDisabled && handleToggleCourse(course.id)}
                      disabled={isDisabled}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{course.duration || 'Self-paced'}</span>
                        <span className="capitalize">{course.level}</span>
                      </div>
                    </div>
                  </div>
                  {alreadyAssigned && (
                    <span className="ml-3 text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full whitespace-nowrap">
                      Already assigned
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No published courses available.</p>
            </div>
          )}
        </>
      )}

      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {selectedCourses.size} course(s) selected
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleCancel} disabled={assigning}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedCourses.size === 0 || assigning}
          >
            {assigning ? 'Assigning...' : `Assign ${selectedCourses.size} Course(s)`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
