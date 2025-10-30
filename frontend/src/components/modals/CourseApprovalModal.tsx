import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { CourseWithStatus } from '../../mocks/adminData';

interface CourseApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseWithStatus;
  onApprove: () => void;
  onReject: (note: string) => void;
}

export const CourseApprovalModal: React.FC<CourseApprovalModalProps> = ({
  isOpen,
  onClose,
  course,
  onApprove,
  onReject,
}) => {
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');

  const handleApprove = () => {
    onApprove();
    setShowRejectBox(false);
    setRejectionNote('');
  };

  const handleReject = () => {
    if (rejectionNote.trim()) {
      onReject(rejectionNote);
      setShowRejectBox(false);
      setRejectionNote('');
    }
  };

  const handleClose = () => {
    setShowRejectBox(false);
    setRejectionNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Approve Course for Publishing">
      <div className="p-6">

        <div className="mb-6 space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Course Title</div>
            <div className="text-lg font-semibold text-gray-900">{course.title}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Description</div>
            <div className="text-gray-700">{course.description}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Created By</div>
              <div className="text-gray-900">{course.creatorName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Level</div>
              <div className="text-gray-900">{course.level}</div>
            </div>
          </div>

          {course.managerNote && (
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Manager's Note</div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-gray-700">
                {course.managerNote}
              </div>
            </div>
          )}
        </div>

        {showRejectBox && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Note
            </label>
            <textarea
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="Provide feedback for revision..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
              rows={3}
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          {!showRejectBox ? (
            <>
              <Button onClick={handleApprove} className="flex-1">
                Approve & Publish
              </Button>
              <Button
                onClick={() => setShowRejectBox(true)}
                variant="secondary"
                className="flex-1"
              >
                Reject with Note
              </Button>
              <Button onClick={handleClose} variant="secondary">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleReject} className="flex-1">
                Submit Rejection
              </Button>
              <Button
                onClick={() => {
                  setShowRejectBox(false);
                  setRejectionNote('');
                }}
                variant="secondary"
              >
                Back
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
