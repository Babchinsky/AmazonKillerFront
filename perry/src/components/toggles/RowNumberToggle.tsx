import { useState } from "react";
import ProductQuantity3 from "../../assets/icons/product-quantity-3.svg?react";
import ProductQuantity5 from "../../assets/icons/product-quantity-5.svg?react";
import "./RowNumberToggle.scss";


interface RowNumberToggleProps {
  className?: string;
  onToggleChange?: (side: "left" | "right") => void;
}

function RowNumberToggle(props: RowNumberToggleProps) {
  const rowNumberToggleClass = `row-number-toggle-container ${props.className}`.trim();
  const [active, setActive] = useState<string>("left");

  const handleToggle = (side: "left" | "right") => {
    setActive(side);
    props.onToggleChange?.(side);
  };

  return (
    <div className={rowNumberToggleClass}>
      <button
        className={`row-number-toggle-left-button ${active === "left" ? "row-number-toggle-active-button" : ""}`}
        onClick={() => handleToggle("left")}
      >
        <ProductQuantity3 className="product-quantity-icon" />
      </button>
      <button
        className={`row-number-toggle-right-button ${active === "right" ? "row-number-toggle-active-button" : ""}`}
        onClick={() => handleToggle("right")}
      >
        <ProductQuantity5 className="product-quantity-icon" />
      </button>
    </div>
  );
}

export default RowNumberToggle;