import { useState } from "react";
import EyeOpen from "../../assets/icons/eye-open.svg?react";
import EyeClosed from "../../assets/icons/eye-closed.svg?react";
import "./TextInput.scss";


interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  title?: string;
  isError?: boolean;
  errorMessage?: string;
}

function TextInput({ className, type = "text", title, isError, errorMessage, ...inputProps }: TextInputProps) {
  const textInputClass = `text-input-container ${className || ""}`.trim();

  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  
  const label = title ?? type.charAt(0).toUpperCase() + type.slice(1);
  const placeholder = inputProps.placeholder ?? `Enter your ${type}`;

  return (
    <div className={textInputClass}>
      <div className="text-input-content-container">
        <label className={isError ? "label-error" : "label"} htmlFor={inputProps.name}>{label}</label>

        <div className="input-container">
          <input
            className="input"
            id={inputProps.name}
            type={inputType}
            placeholder={placeholder}
            {...inputProps}
          />

          {isPassword && (
            <button
              className="toggle-password-button"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
              type="button"
            >
              {showPassword ? <EyeOpen className="eye-icon" /> : <EyeClosed className="eye-icon" />}
            </button>
          )}
        </div>
      </div>

      {isError && errorMessage && (
        <p className="text-input-error">{errorMessage}</p>
      )}
    </div>
  );
}

export default TextInput;