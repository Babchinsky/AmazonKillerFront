import { useEffect, useState } from "react";
import TextButton from "../buttons/TextButton";
import ArrowDown from "../../assets/icons/arrow-down.svg?react";
import "./ComboBox.scss";
import "./PriceComboBox.scss";


interface PriceComboBoxProps {
  title: string;
  isOpen: boolean;
  minPrice: number;
  maxPrice: number;
  onPriceChange?: (minPrice: number, maxPrice: number) => void;
}

function PriceComboBox(props: PriceComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);
  const [minPrice, setMinPrice] = useState<number>(props.minPrice);
  const [maxPrice, setMaxPrice] = useState<number>(props.maxPrice);
  const minGap = 1;
  
  const changePriceInput = (e: React.ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
    const value = Number(e.target.value);

    if (type === "min") {
      if (value < props.minPrice) {
        setMinPrice(props.minPrice);
      }
      else if (value >= props.maxPrice) {
        setMinPrice(props.maxPrice - minGap);
      }
      else {
        setMinPrice(value);
      }
    } 
    else {
      if (value > props.maxPrice) {
        setMaxPrice(props.maxPrice);
      }
      else if (value <= props.minPrice) {
        setMaxPrice(props.minPrice + minGap);
      }
      else {
        setMaxPrice(value);
      }
    }
  };

  const changePriceSlider = (e: React.ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
    const value = Number(e.target.value);
    
    let gap = 0;
    if (type === "min") {
      gap = maxPrice - value;

      if (gap <= minGap) {
        setMinPrice(maxPrice - minGap);
      }
      else {
        setMinPrice(value);
      }
    }
    else {
      gap = value - minPrice;
      
      if (gap <= minGap) {
        setMaxPrice(minPrice + minGap);
      } 
      else {
        setMaxPrice(value);
      }
    }
  };

  useEffect(() => {
    const priceSliderTrack = document.querySelector<HTMLElement>(".price-slider-track");
  
    if (priceSliderTrack) {
      priceSliderTrack.style.left = String(((minPrice - props.minPrice) / (props.maxPrice - props.minPrice)) * 100) + "%";
      priceSliderTrack.style.right = String(100 - ((maxPrice - props.minPrice) / (props.maxPrice - props.minPrice)) * 100) + "%";
    }
  }, [minPrice, maxPrice]);

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
        <div className="price-container">
          <div className="price-top-container">
            <div className="price-input-container">
              <input
                type="number"
                value={minPrice}
                className="price-input"
                onChange={(e) => changePriceInput(e, "min")}
              />

              <hr className="range-divider" />

              <input
                type="number"
                value={maxPrice}
                className="price-input"
                onChange={(e) => changePriceInput(e, "max")}
              />
            </div>

            <TextButton
              className="save-button"
              type="primary"
              content="Save"
              onClick={() => {
                props.onPriceChange?.(minPrice, maxPrice);
              }}
            />
          </div>

          <div className="price-bottom-container">
            <div className="price-slider-container">
              <span className="price-slider-track"></span>
              <input
                type="range"
                min={props.minPrice}
                max={props.maxPrice}
                value={minPrice}
                onChange={(e) => changePriceSlider(e, "min")}
                className="price-slider-min"
              />
              <input
                type="range"
                min={props.minPrice}
                max={props.maxPrice}
                value={maxPrice}
                onChange={(e) => changePriceSlider(e, "max")}
                className="price-slider-max"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceComboBox;