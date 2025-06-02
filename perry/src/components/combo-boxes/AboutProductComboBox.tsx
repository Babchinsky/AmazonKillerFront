import { useEffect, useState } from "react";
import ArrowDown from "../../assets/icons/arrow-down.svg?react";
import "./ComboBox.scss";
import "./AboutProductComboBox.scss";


interface AboutProductComboBoxProps {
  title: string;
  isOpen: boolean;
}

function AboutProductComboBox(props: AboutProductComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);

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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum dignissim tellus quis porta. Curabitur pulvinar mollis enim, et aliquet magna ullamcorper vel. Etiam ante tortor, condimentum nec suscipit posuere, interdum sit amet libero.
          </p>
        </div>
      )}
    </div>
  );
}

export default AboutProductComboBox;