import { JSX } from "react";
import Check from "../assets/icons/check.svg?react";
import "./Checkbox.scss";


interface CheckboxProps {
  label?: string | JSX.Element;
  isChecked: boolean;
  check?: string;
  onChange: (checked: boolean) => void;
}

function Checkbox(props: CheckboxProps) {
  return (
    <label className="checkbox-container">
      <input className="checkbox-input" type="checkbox" checked={props.isChecked} onChange={(e) => props.onChange(e.target.checked)} />
      {!props.check ? (
        <>
          <span className="checkbox-icon-container">
            {props.isChecked && <Check className="check-icon" />}
          </span>
          {props.label && <div className="checkbox-label">{props.label}</div>}
        </>
      ) : (
        <span className="checkbox">{props.check}</span>
      )}
    </label>
  );
}

export default Checkbox;