import { useEffect, useRef, useState } from "react";
import ComboBoxOptionType from "../../types/combo-box-option-type";
import ArrowDownIcon from "../../assets/icons/arrow-down.svg?react";
import CheckIcon from "../../assets/icons/check.svg?react";
import formComboBoxStyles from "./FormComboBox.module.scss";


interface FormComboBoxProps {
  disabled?: boolean;
  name: string;
  title: string;
  options: ComboBoxOptionType[];
  value: ComboBoxOptionType;
  onChange: (value: ComboBoxOptionType) => void;
  isError?: boolean;
  errorMessage?: string;
}

function FormComboBox({disabled, name, title, options, value, onChange, isError = false, errorMessage}: FormComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const label = title ?? "Select option";

  const handleSelect = (option: ComboBoxOptionType) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={formComboBoxStyles.formComboBoxContainer} ref={containerRef}>
      <div className={formComboBoxStyles.contentContainer}>
        <label htmlFor={name} className={isError ? formComboBoxStyles.labelError : formComboBoxStyles.label}>
          {label}
        </label>

        <div
          className={formComboBoxStyles.comboBox}
          onClick={() => {
            if (!disabled) {
              return setIsOpen((prev) => !prev);
            }

            return;
          }}
        >
          <p className={value.id === "select" ? formComboBoxStyles.default : ""}>{value.label}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
          >
            <ArrowDownIcon className={`${formComboBoxStyles.arrowDownIcon} ${isOpen ? formComboBoxStyles.arrowDownIconOpen : ""}`} />
          </button>
        </div>

        {isOpen && (
          <div className={formComboBoxStyles.optionsContainer}>
            {options.map((option) => (
              <div
                key={option.id}
                className={`
                  ${option.id === "select" ? formComboBoxStyles.hiddenOption : value.id === option.id ? formComboBoxStyles.selectedOption : formComboBoxStyles.option}
                `}
                onClick={() => handleSelect(option)}
              >
                <CheckIcon className={formComboBoxStyles.checkIcon} />
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {isError && errorMessage && (
        <p className={formComboBoxStyles.errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
}

export default FormComboBox;