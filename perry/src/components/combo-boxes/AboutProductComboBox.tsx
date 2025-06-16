import { useState } from "react";
import ArrowDownIcon from "../../assets/icons/arrow-down.svg?react";
import comboBoxStyles from "./ComboBox.module.scss";
import aboutProductComboBoxStyles from "./AboutProductComboBox.module.scss";


interface AboutProductComboBoxProps {
  title: string;
  description: string;
  isOpen: boolean;
}

function AboutProductComboBox(props: AboutProductComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);

  return (
    <div className={`${comboBoxStyles.comboBoxContainer} ${aboutProductComboBoxStyles.comboBoxContainer}`}>
      <div className={aboutProductComboBoxStyles.titleContainer} onClick={() => setIsFilterOpen(prev => !prev)}>
        <p>{props.title}</p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFilterOpen(prev => !prev);
          }}
        >
          <ArrowDownIcon className={`${aboutProductComboBoxStyles.arrowDownIcon} ${isFilterOpen ? aboutProductComboBoxStyles["arrowDownIconOpen"] : ""}`} />
        </button>
      </div>

      {isFilterOpen && (
        <div className={aboutProductComboBoxStyles.optionsContainer}>
          <p>{props.description}</p>
        </div>
      )}
    </div>
  );
}

export default AboutProductComboBox;