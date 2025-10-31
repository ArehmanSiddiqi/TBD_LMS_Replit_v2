import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: 'primary' | 'danger';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmVariant = 'primary',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="mb-6">
        <p className="text-gray-600">{message}</p>
      </div>

      <div className="border-t border-gray-200 pt-4 flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          className={confirmVariant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </div>
    </Modal>
  );
};
