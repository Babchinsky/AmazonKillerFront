import { JSX } from "react";
import CheckIcon from "../../assets/icons/check.svg?react";
import checkboxStyles from "./Checkbox.module.scss";


interface CheckboxProps {
  label?: string | JSX.Element;
  isChecked: boolean;
  check?: string;
  onChange: (checked: boolean) => void;
}

function Checkbox(props: CheckboxProps) {
  return (
    <label className={checkboxStyles.checkboxContainer}>
      <input type="checkbox" checked={props.isChecked} onChange={(e) => props.onChange(e.target.checked)} />
      {!props.check ? (
        <>
          <span className={checkboxStyles.checkboxIconContainer}>
            {props.isChecked && <CheckIcon className={checkboxStyles.checkIcon} />}
          </span>
          {props.label && <div className={checkboxStyles.checkboxLabel}>{props.label}</div>}
        </>
      ) : (
        <span className={checkboxStyles.checkbox}>{props.check}</span>
      )}
    </label>
  );
}

export default Checkbox;