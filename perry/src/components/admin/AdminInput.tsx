import React, { ChangeEvent } from 'react';
import './AdminInput.scss';

export interface AdminInputProps {
  value: string | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isError?: boolean;
  errorMessage?: string;
  id?: string;
}

const AdminInput: React.FC<AdminInputProps> = ({
  value = '',
  onChange,
  placeholder,
  type = 'text',
  required,
  readOnly,
  maxLength,
  showCharCount,
  label,
  icon,
  onClick,
  className,
  isError,
  errorMessage,
  id
}) => {
  const inputValue = value ?? '';
  
  return (
    <div className={`text-input ${className || ''}`}>
      {label && (
        <div className="text-input__label-container">
          <label className="text-input__label">{label}</label>
        </div>
      )}
      <div className={`text-input__container ${isError ? 'error' : ''}`}>
        {icon && <div className="text-input__icon">{icon}</div>}
        <input
          id={id}
          type={type}
          value={inputValue}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          maxLength={maxLength}
          className={`text-input__field ${icon ? 'text-input__field--with-icon' : ''}`}
          onClick={onClick}
        />
        {showCharCount && maxLength && (
          <div className="text-input__char-count">
            {inputValue.length} / {maxLength}
          </div>
        )}
      </div>
      {isError && errorMessage && (
        <div className="text-input__error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default AdminInput;