import { useState } from "react";
import ArrowDownIcon from "../../assets/icons/arrow-down.svg?react";
import comboBoxStyles from "./ComboBox.module.scss";


interface AppliedFiltersComboBoxProps {
  isOpen: boolean;
}

function AppliedFiltersComboBox(props: AppliedFiltersComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);

  return (
    <div className={comboBoxStyles.smallComboBoxContainer}>
      <div className={comboBoxStyles.smallComboBoxTopContainer}>
        <div className={comboBoxStyles.titleContainer} onClick={() => setIsFilterOpen(prev => !prev)}>
          <p></p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFilterOpen(prev => !prev);
            }}
          >
            <ArrowDownIcon className={`${comboBoxStyles.arrowDownIcon} ${isFilterOpen ? comboBoxStyles["arrowDownIconOpen"] : ""}`} />
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <></>
      )}
    </div>
  );
}

export default AppliedFiltersComboBox;