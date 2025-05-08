import { useEffect, useState } from "react";
import ComboBoxOptionType from "../../types/combo-box-option-type";
import Checkbox from "../Checkbox";
import ArrowDown from "../../assets/icons/arrow-down.svg?react";
import Search from "../../assets/icons/search.svg?react";
import "./ComboBox.scss";
import "./FilterComboBox.scss";


interface FilterComboBoxProps {
  type: "list" | "grid";
  title: string;
  options: ComboBoxOptionType[];
  isOpen: boolean;
  onSelect: (selectedOptions: string[]) => void;
}

function FilterComboBox(props: FilterComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const filteredOptions = props.options.filter(option => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
  const optionsClass = `options-${props.type}`.trim();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOptionToggle = (option: string) => {
    setSelectedOptions(prevSelected =>
      prevSelected.includes(option)
        ? prevSelected.filter(o => o !== option)
        : [...prevSelected, option]
    );
  };

  useEffect(() => {
    props.onSelect(selectedOptions);
  }, [selectedOptions, props]);

  return (
    <div className="filter-combo-box-container">
      <div className="title-container" onClick={() => setIsFilterOpen(prev => !prev)}>
        <p>{props.title}</p>

        <button 
          className="filter-combo-box-button" 
          onClick={(e) => {
            e.stopPropagation();
            setIsFilterOpen(prev => !prev);
          }}
        >
          <ArrowDown className={`arrow-down-icon ${isFilterOpen ? "arrow-down-icon-open" : ""}`} />
        </button>
      </div>

      {isFilterOpen && (
        <>
          {(props.type === "list" || props.type === "grid") && (
            <div className="search-bar-container">
              <button className="search-bar-button">
                <Search className="search-icon" />
              </button>
              <input
                className="search-bar-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          )}

          <div className="options-container">
            {props.type === "list" && (
              <ul className={optionsClass}>
                {filteredOptions.map((option) => (
                  <li key={option.id}>
                    <Checkbox 
                      label={option.label} 
                      isChecked={selectedOptions.includes(option.id)} 
                      onChange={() => handleOptionToggle(option.id)} 
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
                      isChecked={selectedOptions.includes(option.id)} 
                      check={option.label}
                      onChange={() => handleOptionToggle(option.id)} 
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