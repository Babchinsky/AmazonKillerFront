import { useState } from "react";
import EyeOpenIcon from "../../assets/icons/eye-open.svg?react";
import EyeClosedIcon from "../../assets/icons/eye-closed.svg?react";
import formInputStyles from "./FormInput.module.scss";


interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  title?: string;
  isError?: boolean;
  errorMessage?: string;
}

function FormInput({className, type = "text", title, isError, errorMessage, ...inputProps}: FormInputProps) {
  const formInputClass = `${formInputStyles.formInputContainer} ${className || ""}`.trim();

  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  
  const label = title ?? type.charAt(0).toUpperCase() + type.slice(1);
  const placeholder = inputProps.placeholder ?? `Enter your ${type}`;

  return (
    <div className={formInputClass}>
      <div className={formInputStyles.contentContainer}>
        <label className={isError ? formInputStyles.labelError : formInputStyles.label} htmlFor={inputProps.name}>{label}</label>

        <div className={formInputStyles.inputContainer}>
          <input
            id={inputProps.name}
            type={inputType}
            placeholder={placeholder}
            {...inputProps}
          />

          {isPassword && (
            <button
              className={formInputStyles.togglePasswordButton}
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
              type="button"
            >
              {showPassword ? <EyeOpenIcon className={formInputStyles.eyeIcon} /> : <EyeClosedIcon className={formInputStyles.eyeIcon} />}
            </button>
          )}
        </div>
      </div>

      {isError && errorMessage && (
        <p className={formInputStyles.errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
}

export default FormInput;