import { useEffect, useState } from "react";
import ComboBoxOptionType from "../../types/combo-box-option-type";
import Checkbox from "../checkboxes/Checkbox";
import ArrowDownIcon from "../../assets/icons/arrow-down.svg?react";
import SearchIcon from "../../assets/icons/search.svg?react";
import comboBoxStyles from "./ComboBox.module.scss";
import filterComboBoxStyles from "./FilterComboBox.module.scss";


interface FilterComboBoxProps {
  type: "list" | "grid";
  title: string;
  options: ComboBoxOptionType[];
  selectedOptions: string[];
  isOpen: boolean;
  onSelect: (selectedOptions: string[]) => void;
}

function FilterComboBox(props: FilterComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredOptions = props.options.filter(option => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
  const optionsClass = `options${props.type.charAt(0).toUpperCase() + props.type.slice(1)}`.trim();

  const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleOption = (option: string) => {
    const newSelected = props.selectedOptions.includes(option)
      ? props.selectedOptions.filter(o => o !== option)
      : [...props.selectedOptions, option];
    props.onSelect(newSelected);
  };

  return (
    <div className={comboBoxStyles.comboBoxContainer}>
      <div className={comboBoxStyles.titleContainer} onClick={() => setIsFilterOpen(prev => !prev)}>
        <p>{props.title}</p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFilterOpen(prev => !prev);
          }}
        >
          <ArrowDownIcon className={`${comboBoxStyles.arrowDownIcon} ${isFilterOpen ? comboBoxStyles["arrowDownIconOpen"] : ""}`} />
        </button>
      </div>

      {isFilterOpen && (
        <>
          {(props.type === "list" || props.type === "grid") && (
            <div className={filterComboBoxStyles.searchBarContainer}>
              <button>
                <SearchIcon className={filterComboBoxStyles.searchIcon} />
              </button>
              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={changeSearch}
              />
            </div>
          )}

          <div className={comboBoxStyles.optionsContainer}>
            {props.type === "list" && (
              <ul className={optionsClass}>
                {filteredOptions.map((option) => (
                  <li key={option.id}>
                    <Checkbox 
                      label={option.label} 
                      isChecked={props.selectedOptions.includes(option.id)} 
                      onChange={() => toggleOption(option.id)} 
                    />
                  </li>
                ))}
              </ul>
            )}

            {props.type === "grid" && (
              <div className={optionsClass}>
                {filteredOptions.map((option) => (
                  <div key={option.id}>
                    <Checkbox
                      isChecked={props.selectedOptions.includes(option.id)} 
                      check={option.label}
                      onChange={() => toggleOption(option.id)} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default FilterComboBox;