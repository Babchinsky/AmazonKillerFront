import CheckIcon from "../../assets/icons/check.svg?react";
import paymentMethodToggleStyles from "./PaymentMethodToggle.module.scss";


export type PaymentMethod = "cash" | "card";

interface PaymentMethodToggleProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

function PaymentMethodToggle({ selected, onChange }: PaymentMethodToggleProps) {
  return (
    <div className={paymentMethodToggleStyles.paymentMethodToggleContainer}>
      <button
        type="button"
        className={`${paymentMethodToggleStyles.toggleButton} ${selected === "cash" ? paymentMethodToggleStyles.toggleActiveButton : ""}`}
        onClick={() => onChange("cash")}
      >
        Cash {selected === "cash" && <CheckIcon className={paymentMethodToggleStyles.checkIcon} />}
      </button>
      <button
        type="button"
        className={`${paymentMethodToggleStyles.toggleButton} ${selected === "card" ? paymentMethodToggleStyles.toggleActiveButton : ""}`}
        onClick={() => onChange("card")}
      >
        Card {selected === "card" && <CheckIcon className={paymentMethodToggleStyles.checkIcon} />}
      </button>
    </div>
  );
}

export default PaymentMethodToggle;