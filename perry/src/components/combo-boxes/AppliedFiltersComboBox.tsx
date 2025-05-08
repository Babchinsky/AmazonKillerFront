import { useState } from "react";
import ArrowDown from "../../assets/icons/arrow-down.svg?react";
import "./ComboBox.scss";
import "./AppliedFiltersComboBox.scss";


interface AppliedFiltersComboBoxProps {
  isOpen: boolean;
}

function AppliedFiltersComboBox(props: AppliedFiltersComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);

  return (
    <div className="small-combo-box-container">
      <div className="small-combo-box-top-container">
        <div className="title-container" onClick={() => setIsFilterOpen(prev => !prev)}>
          <p></p>

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
        <></>
      )}
    </div>
  );
}

export default AppliedFiltersComboBox;