import { useEffect, useRef, useState } from "react";
import Button from "../buttons/Button";
import ArrowDownIcon from "../../assets/icons/arrow-down.svg?react";
import comboBoxStyles from "./ComboBox.module.scss";
import priceComboBoxStyles from "./PriceComboBox.module.scss";


interface PriceComboBoxProps {
  title: string;
  isOpen: boolean;
  minPrice: number;
  maxPrice: number;
  onPriceChange?: (minPrice: number, maxPrice: number) => void;
  minSelectedPrice: number | null;
  maxSelectedPrice: number | null;
}

function PriceComboBox(props: PriceComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);
  const [minPrice, setMinPrice] = useState<number>(props.minPrice);
  const [maxPrice, setMaxPrice] = useState<number>(props.maxPrice);
  const minGap = 1;

  const trackRef = useRef<HTMLSpanElement>(null);
  
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
    if (trackRef.current) {
      trackRef.current.style.left =
        ((minPrice - props.minPrice) / (props.maxPrice - props.minPrice)) * 100 + "%";

      trackRef.current.style.right =
        100 - ((maxPrice - props.minPrice) / (props.maxPrice - props.minPrice)) * 100 + "%";
    }
  }, [minPrice, maxPrice]);

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
        <div className={priceComboBoxStyles.priceContainer}>
          <div className={priceComboBoxStyles.priceTopContainer}>
            <div className={priceComboBoxStyles.priceInputContainer}>
              <input
                className={priceComboBoxStyles.priceInput}
                type="number"
                value={minPrice}
                onChange={(e) => changePriceInput(e, "min")}
              />

              <hr />

              <input
                className={priceComboBoxStyles.priceInput}
                type="number"
                value={maxPrice}
                onChange={(e) => changePriceInput(e, "max")}
              />
            </div>

            <Button
              className={priceComboBoxStyles.saveButton}
              type="primary"
              content="Save"
              onClick={() => {
                props.onPriceChange?.(minPrice, maxPrice);
              }}
            />
          </div>

          <div className={priceComboBoxStyles.priceBottomContainer}>
            <div className={priceComboBoxStyles.priceSliderContainer}>
              <span ref={trackRef} className={priceComboBoxStyles.sliderTrack}></span>
              <input
                className={priceComboBoxStyles.sliderMin}
                type="range"
                min={props.minPrice}
                max={props.maxPrice}
                value={minPrice}
                onChange={(e) => changePriceSlider(e, "min")}
              />
              <input
                className={priceComboBoxStyles.sliderMax}
                type="range"
                min={props.minPrice}
                max={props.maxPrice}
                value={maxPrice}
                onChange={(e) => changePriceSlider(e, "max")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceComboBox;