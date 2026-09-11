import React from 'react';
import Modal from './Modal';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  isLoading = false
}) => {
  const footer = (
    <>
      <SecondaryButton onClick={onClose} disabled={isLoading} size="sm" variant="outline">
        {cancelText}
      </SecondaryButton>
      <PrimaryButton
        onClick={onConfirm}
        disabled={isLoading}
        size="sm"
        className={isDanger ? 'btn-danger' : 'btn-primary'}
      >
        {isLoading ? 'Processing...' : confirmText}
      </PrimaryButton>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} maxWidth="28rem">
      <p className="text-muted" style={{ margin: 0 }}>{message}</p>
    </Modal>
  );
};

export default ConfirmationDialog;
