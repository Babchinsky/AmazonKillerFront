import { useEffect, useState } from "react";
import Checkbox from "../checkboxes/Checkbox";
import Stars from "../stars/Stars";
import ArrowDownIcon from "../../assets/icons/arrow-down.svg?react";
import comboBoxStyles from "./ComboBox.module.scss";


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
        <div className={comboBoxStyles.optionsContainer}>
          <ul className={comboBoxStyles.optionsRating}>
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