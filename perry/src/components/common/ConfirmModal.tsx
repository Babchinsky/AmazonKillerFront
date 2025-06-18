import React from 'react';
import './ConfirmModal.scss';

export interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'delete' | 'redirect' | 'status-change';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type = 'delete'
}) => {
  const getButtonText = () => {
    if (confirmText || cancelText) {
      return {
        confirm: confirmText || (type === 'delete' ? 'Delete' : 'Yes'),
        cancel: cancelText || (type === 'delete' ? 'Cancel' : 'No')
      };
    }

    return type === 'delete' 
      ? { confirm: 'Delete', cancel: 'Cancel' }
      : { confirm: 'Yes', cancel: 'No' };
  };

  const buttonText = getButtonText();

  if (!isOpen) return null;

  return (
    <div className="confirm-modal">
      <div className="confirm-modal__overlay" onClick={onCancel} />
      <div className="confirm-modal__content">
        <div className="confirm-modal__header">
          <h2 className="confirm-modal__header-title">{title}</h2>
          <div className="confirm-modal__header-divider" />
        </div>
        <div className="confirm-modal__message">{message}</div>
        <div className="confirm-modal__buttons">
          <button 
            className={`confirm-modal__button confirm-modal__button--cancel ${type}`}
            onClick={onCancel}
          >
            {buttonText.cancel}
          </button>
          <button 
            className={`confirm-modal__button confirm-modal__button--confirm ${type}`}
            onClick={onConfirm}
          >
            {buttonText.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}; 