import { useEffect, useState } from "react";
import Button from "../buttons/Button";
import ArrowDownIcon from "../../assets/icons/arrow-down.svg?react";
import CloseIcon from "../../assets/icons/close.svg?react";
import comboBoxStyles from "./ComboBox.module.scss";
import appliedFiltersComboBoxStyles from "./AppliedFiltersComboBox.module.scss";


interface AppliedFiltersComboBoxProps {
  isOpen: boolean;
  selectedFilters: {[filterName: string]: string[]};
  onRemoveFilter: (filterName: string, value: string) => void;
  onClearAll: () => void;
}

function AppliedFiltersComboBox(props: AppliedFiltersComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);

  const totalFilters = Object.values(props.selectedFilters).reduce((sum, arr) => sum + arr.length, 0);
  
  useEffect(() => {
    if (totalFilters === 0) {
      setIsFilterOpen(false);
    }
  }, [totalFilters]);

  return (
    totalFilters > 0 && (
      <div className={comboBoxStyles.smallComboBoxContainer}>
        <div className={comboBoxStyles.smallComboBoxTopContainer}>
          <div className={comboBoxStyles.titleContainer} onClick={() => setIsFilterOpen(prev => !prev)}>
            <p>{totalFilters} filter{totalFilters !== 1 ? "s" : ""} applied</p>

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
          <div className={comboBoxStyles.smallComboBoxBottomContainer}>
            <div className={comboBoxStyles.optionsContainer}>
              <div className={appliedFiltersComboBoxStyles.filterTagsContainer}>
                {Object.entries(props.selectedFilters).map(([filterName, values]) =>
                  values.map((val) => (
                    <div key={`${filterName}-${val}`} className={appliedFiltersComboBoxStyles.filterTagContainer}>
                      <p>{`${val}`}</p>
                      <button onClick={() => props.onRemoveFilter(filterName, val)}>
                        <CloseIcon className={appliedFiltersComboBoxStyles.closeIcon} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <hr className="divider" />

              <div>
                <Button type="tertiary" content="Clear all" onClick={props.onClearAll} />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default AppliedFiltersComboBox;