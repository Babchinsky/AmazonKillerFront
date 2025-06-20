// import { useCallback, useEffect, useRef, useState } from "react";
// import Button from "../buttons/Button";
// import ArrowDownIcon from "../../assets/icons/arrow-down.svg?react";
// import comboBoxStyles from "./ComboBox.module.scss";
// import priceComboBoxStyles from "./PriceComboBox.module.scss";


// interface PriceComboBoxProps {
//   title: string;
//   isOpen: boolean;
//   initialMinPrice: number;
//   initialMaxPrice: number;
//   onPriceChange: (range: { min: number; max: number }) => void;
//   onSave: () => void;
// }

// function PriceComboBox(props: PriceComboBoxProps) {
//   const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);
  
//   const [minPrice, setMinPrice] = useState<number>(props.initialMinPrice);
//   const [maxPrice, setMaxPrice] = useState<number>(props.initialMaxPrice);
//   const minPriceRef = useRef(props.initialMinPrice);
//   const maxPriceRef = useRef(props.initialMaxPrice);
//   const range = useRef<HTMLSpanElement>(null);
//   const gap = 1;

//   const getPercent = useCallback(
//     (value: number) => Math.round(((value - props.initialMinPrice) / (props.initialMaxPrice - props.initialMinPrice)) * 100),
//     [props.initialMinPrice, props.initialMaxPrice]
//   );

//   useEffect(() => {
//     setMinPrice(props.initialMinPrice);
//     setMaxPrice(props.initialMaxPrice);
//   }, [props.initialMinPrice, props.initialMaxPrice]);

//   useEffect(() => {
//     const minPercent = getPercent(minPrice);
//     const maxPercent = getPercent(maxPriceRef.current);

//     if (range.current) {
//       range.current.style.left = `${minPercent}%`;
//       range.current.style.width = `${maxPercent - minPercent}%`;
//     }
//   }, [minPrice, getPercent]);

//   useEffect(() => {
//     const minPercent = getPercent(minPriceRef.current);
//     const maxPercent = getPercent(maxPrice);

//     if (range.current) {
//       range.current.style.width = `${maxPercent - minPercent}%`;
//     }
//   }, [maxPrice, getPercent]);

//   useEffect(() => {
//     if (minPrice != minPriceRef.current || maxPrice != maxPriceRef.current) {
//       props.onPriceChange({min: minPrice, max: maxPrice});
//       minPriceRef.current = minPrice;
//       maxPriceRef.current = maxPrice;
//     }
//   }, [minPrice, maxPrice, props.onPriceChange]);

//   return (
//     <div className={comboBoxStyles.comboBoxContainer}>
//       <div className={comboBoxStyles.titleContainer} onClick={() => setIsFilterOpen(prev => !prev)}>
//         <p>{props.title}</p>

//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsFilterOpen(prev => !prev);
//           }}
//         >
//           <ArrowDownIcon className={`${comboBoxStyles.arrowDownIcon} ${isFilterOpen ? comboBoxStyles["arrowDownIconOpen"] : ""}`} />
//         </button>
//       </div>

//       {isFilterOpen && (
//         <div className={priceComboBoxStyles.priceContainer}>
//           <div className={priceComboBoxStyles.priceTopContainer}>
//             <div className={priceComboBoxStyles.priceInputContainer}>
//               <input
//                 className={priceComboBoxStyles.priceInput}
//                 type="number"
//                 min={props.initialMinPrice}
//                 max={maxPrice - gap}
//                 value={minPrice}
//                 onChange={(e) => {
//                   let value = Number(e.target.value);
//                   value = Math.max(props.initialMinPrice, Math.min(value, maxPrice - gap));
//                   setMinPrice(value);
//                 }}
//               />

//               <hr />

//               <input
//                 className={priceComboBoxStyles.priceInput}
//                 type="number"
//                 min={minPrice + gap}
//                 max={props.initialMaxPrice}
//                 value={maxPrice}
//                 onChange={(e) => {
//                   let value = Number(e.target.value);
//                   value = Math.min(props.initialMaxPrice, Math.max(value, minPrice + gap));
//                   setMaxPrice(value);
//                 }}
//               />
//             </div>

//             <Button
//               className={priceComboBoxStyles.saveButton}
//               type="primary"
//               content="Save"
//               onClick={props.onSave}
//             />
//           </div>

//           <div className={priceComboBoxStyles.priceBottomContainer}>
//             <div className={priceComboBoxStyles.priceSliderContainer}>
//               <span ref={range} className={priceComboBoxStyles.sliderTrack}></span>
//               <input
//                 className={priceComboBoxStyles.sliderMin}
//                 type="range"
//                 min={props.initialMinPrice}
//                 max={props.initialMaxPrice}
//                 value={minPrice}
//                 onChange={(e) => {
//                   const value = Math.min(Number(e.target.value), maxPrice - gap);
//                   setMinPrice(value);
//                 }}
//               />
//               <input
//                 className={priceComboBoxStyles.sliderMax}
//                 type="range"
//                 min={props.initialMinPrice}
//                 max={props.initialMaxPrice}
//                 value={maxPrice}
//                 onChange={(e) => {
//                   const value = Math.max(Number(e.target.value), minPrice + gap);
//                   setMaxPrice(value);
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PriceComboBox;



import { useCallback, useEffect, useRef, useState } from "react";
import Button from "../buttons/Button";
import ArrowDownIcon from "../../assets/icons/arrow-down.svg?react";
import comboBoxStyles from "./ComboBox.module.scss";
import priceComboBoxStyles from "./PriceComboBox.module.scss";


interface PriceComboBoxProps {
  title: string;
  isOpen: boolean;
  initialMinPrice: number;
  initialMaxPrice: number;
  selectedMinPrice: number;
  selectedMaxPrice: number;
  onPriceChange: (range: { min: number; max: number }) => void;
  onSave: () => void;
}

function PriceComboBox(props: PriceComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);

  const [localMin, setLocalMin] = useState<number>(props.selectedMinPrice);
  const [localMax, setLocalMax] = useState<number>(props.selectedMaxPrice);

  const range = useRef<HTMLSpanElement>(null);
  const gap = 1;

  const getPercent = useCallback(
    (value: number) =>
      Math.round(
        ((value - props.initialMinPrice) /
          (props.initialMaxPrice - props.initialMinPrice)) *
          100
      ),
    [props.initialMinPrice, props.initialMaxPrice]
  );

  useEffect(() => {
    setLocalMin(props.selectedMinPrice);
    setLocalMax(props.selectedMaxPrice);
  }, [props.selectedMinPrice, props.selectedMaxPrice]);

  useEffect(() => {
    const minPercent = getPercent(localMin);
    const maxPercent = getPercent(localMax);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [localMin, localMax, getPercent]);

  useEffect(() => {
    props.onPriceChange({ min: localMin, max: localMax });
  }, [localMin, localMax]);

  return (
    <div className={comboBoxStyles.comboBoxContainer}>
      <div
        className={comboBoxStyles.titleContainer}
        onClick={() => setIsFilterOpen((prev) => !prev)}
      >
        <p>{props.title}</p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFilterOpen((prev) => !prev);
          }}
        >
          <ArrowDownIcon
            className={`${comboBoxStyles.arrowDownIcon} ${
              isFilterOpen ? comboBoxStyles["arrowDownIconOpen"] : ""
            }`}
          />
        </button>
      </div>

      {isFilterOpen && (
        <div className={priceComboBoxStyles.priceContainer}>
          <div className={priceComboBoxStyles.priceTopContainer}>
            <div className={priceComboBoxStyles.priceInputContainer}>
              <input
                className={priceComboBoxStyles.priceInput}
                type="number"
                min={props.initialMinPrice}
                max={localMax - gap}
                value={localMin}
                onChange={(e) => {
                  let value = Number(e.target.value);
                  value = Math.max(
                    props.initialMinPrice,
                    Math.min(value, localMax - gap)
                  );
                  setLocalMin(value);
                }}
              />

              <hr />

              <input
                className={priceComboBoxStyles.priceInput}
                type="number"
                min={localMin + gap}
                max={props.initialMaxPrice}
                value={localMax}
                onChange={(e) => {
                  let value = Number(e.target.value);
                  value = Math.min(
                    props.initialMaxPrice,
                    Math.max(value, localMin + gap)
                  );
                  setLocalMax(value);
                }}
              />
            </div>

            <Button
              className={priceComboBoxStyles.saveButton}
              type="primary"
              content="Save"
              onClick={props.onSave}
            />
          </div>

          <div className={priceComboBoxStyles.priceBottomContainer}>
            <div className={priceComboBoxStyles.priceSliderContainer}>
              <span ref={range} className={priceComboBoxStyles.sliderTrack}></span>
              <input
                className={priceComboBoxStyles.sliderMin}
                type="range"
                min={props.initialMinPrice}
                max={props.initialMaxPrice}
                value={localMin}
                onChange={(e) => {
                  const value = Math.min(
                    Number(e.target.value),
                    localMax - gap
                  );
                  setLocalMin(value);
                }}
              />
              <input
                className={priceComboBoxStyles.sliderMax}
                type="range"
                min={props.initialMinPrice}
                max={props.initialMaxPrice}
                value={localMax}
                onChange={(e) => {
                  const value = Math.max(
                    Number(e.target.value),
                    localMin + gap
                  );
                  setLocalMax(value);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceComboBox;