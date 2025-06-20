import { useState } from "react";
import ComboBoxOptionType from "../../types/combo-box-option-type";
import ArrowDownIcon from "../../assets/icons/arrow-down.svg?react";
import CheckIcon from "../../assets/icons/check.svg?react";
import comboBoxStyles from "./ComboBox.module.scss";


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
    <div className={comboBoxStyles.smallComboBoxContainer}>
      <div className={comboBoxStyles.smallComboBoxTopContainer} onClick={() => setIsFilterOpen(prev => !prev)}>
        <div className={comboBoxStyles.titleContainer}>
          <p>{selectedOption.label}</p>
          <ArrowDownIcon className={`${comboBoxStyles.arrowDownIcon} ${isFilterOpen ? comboBoxStyles["arrowDownIconOpen"] : ""}`} />
        </div>
      </div>

      {isFilterOpen && (
        <div className={comboBoxStyles.smallComboBoxBottomContainer}>
          <div className={comboBoxStyles.optionsContainer}>
            {props.options.map(option => (
              <div
                key={option.id} 
                className={`${selectedOption.id === option.id ? comboBoxStyles["selectedOption"] : comboBoxStyles["option"]}`}
                onClick={() => selectOption(option)}
              >
                <CheckIcon className={comboBoxStyles.checkIcon} />
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