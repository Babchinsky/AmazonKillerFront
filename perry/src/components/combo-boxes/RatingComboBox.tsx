import { useEffect, useState } from "react";
import Checkbox from "../Checkbox";
import Stars from "../Stars";
import ArrowDown from "../../assets/icons/arrow-down.svg?react";
import "./ComboBox.scss";
import "./RatingComboBox.scss";


interface RatingComboBoxProps {
  title: string;
  isOpen: boolean;
  onSelect: (selectedRatings: number[]) => void;
}

function RatingComboBox(props: RatingComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const toggleRating = (rating: number) => {
    setSelectedOptions((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  useEffect(() => {
    props.onSelect(selectedOptions);
  }, [selectedOptions, props.onSelect]);

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
        <div className="options-container">
          <ul className="options-rating">
            {[5, 4, 3, 2, 1].map((count) => (
              <li key={count}>
                <Checkbox
                  label={<Stars count={count} />}
                  isChecked={selectedOptions.includes(count)}
                  onChange={() => toggleRating(count)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RatingComboBox;