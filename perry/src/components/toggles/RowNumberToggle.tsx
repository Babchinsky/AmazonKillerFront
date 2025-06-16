import ProductQuantity3Icon from "../../assets/icons/product-quantity-3.svg?react";
import ProductQuantity5Icon from "../../assets/icons/product-quantity-5.svg?react";
import rowNumberToggleStyles from "./RowNumberToggle.module.scss";


interface RowNumberToggleProps {
  className?: string;
  side: "left" | "right";
  onToggleChange?: (side: "left" | "right") => void;
}

function RowNumberToggle(props: RowNumberToggleProps) {
  const rowNumberToggleClass = `${rowNumberToggleStyles.toggleContainer} ${props.className}`.trim();
  
  const handleToggle = (side: "left" | "right") => {
    if (props.side !== side) {
      props.onToggleChange?.(side);
    }
  };

  return (
    <div className={rowNumberToggleClass}>
      <button
        className={`${rowNumberToggleStyles.toggleLeftButton} ${
          props.side === "left" ? rowNumberToggleStyles.toggleActiveButton : ""
        }`}
        onClick={() => handleToggle("left")}
      >
        <ProductQuantity3Icon className={rowNumberToggleStyles.productQuantityIcon} />
      </button>
      <button
        className={`${rowNumberToggleStyles.toggleRightButton} ${
          props.side === "right" ? rowNumberToggleStyles.toggleActiveButton : ""
        }`}
        onClick={() => handleToggle("right")}
      >
        <ProductQuantity5Icon className={rowNumberToggleStyles.productQuantityIcon} />
      </button>
    </div>
  );
}

export default RowNumberToggle;