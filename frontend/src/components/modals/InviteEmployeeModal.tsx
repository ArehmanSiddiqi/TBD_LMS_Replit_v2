import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface InviteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteEmployeeModal: React.FC<InviteEmployeeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleSendInvitation = () => {
    onClose();
    setFullName('');
    setEmail('');
  };

  const handleCancel = () => {
    onClose();
    setFullName('');
    setEmail('');
  };

  const isFormValid = fullName.trim() !== '' && email.trim() !== '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Invite Employee"
      subtitle="Send an invitation to join the Taleemabad University L&D platform."
    >
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter employee's full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="employee@example.com"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 flex gap-3 justify-end">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSendInvitation} disabled={!isFormValid}>
          Send Invitation
        </Button>
      </div>
    </Modal>
  );
};
