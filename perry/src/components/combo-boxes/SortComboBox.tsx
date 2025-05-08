import { useState } from "react";
import ComboBoxOptionType from "../../types/combo-box-option-type";
import ArrowDown from "../../assets/icons/arrow-down.svg?react";
import Check from "../../assets/icons/check.svg?react";
import "./ComboBox.scss";
import "./SortComboBox.scss";


interface SortComboBoxProps {
  isOpen: boolean;
  options: ComboBoxOptionType[];
  selectedOption: ComboBoxOptionType; 
  onSortChange?: (sortOption: ComboBoxOptionType) => void;
}

function SortComboBox(props: SortComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);
  const [selectedOption, setSelectedOption] = useState<ComboBoxOptionType>(props.options[0]);

  const selectOption = (option: ComboBoxOptionType) => {
    setSelectedOption(option);
    setIsFilterOpen(false);
    props.onSortChange?.(option);
  };

  return (
    <div className="small-combo-box-container">
      <div className="small-combo-box-top-container">
        <div className="title-container" onClick={() => setIsFilterOpen(prev => !prev)}>
          <p>{selectedOption.label}</p>

          <button 
            className="combo-box-button" 
            onClick={(e) => {
              e.stopPropagation();
              setIsFilterOpen(prev => !prev);
            }}
          >
            <ArrowDown className={`arrow-down-icon ${isFilterOpen ? "arrow-down-icon-open" : ""}`} />
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="small-combo-box-bottom-container">
          <div className="options-container">
            {props.options.map(option => (
              <div
                key={option.id} 
                className={`${selectedOption.id === option.id ? "selected-option" : "option"}`}
                onClick={() => selectOption(option)}
              >
                <Check className="check-icon" />
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SortComboBox;