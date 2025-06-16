import { Link } from "react-router";
import React from "react";
import buttonStyles from "./Button.module.scss";


interface ButtonProps {
  className?: string;
  type: "primary" | "secondary" | "tertiary" | "destructive";
  disabled?: boolean;
	content?: string;
  leftIcon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  rightIcon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  linkTo?: string;
  onClick?: () => void;
}

function Button(props: ButtonProps) {
  const buttonClass = `${buttonStyles.button} ${buttonStyles[`${props.type}Button`]} ${props.className || ""} ${props.linkTo ? "link" : ""}`.trim();

  const renderIcon = (icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>) =>
    icon ? (
      <span className={buttonStyles.icon}>
        {React.cloneElement(icon)}
      </span>
    ) : null;

  const buttonContent = (
    <span className={buttonStyles.content}>
      {renderIcon(props.leftIcon)}
      {props.content && <span>{props.content}</span>}
      {renderIcon(props.rightIcon)}
    </span>
  );

  return (
    props.linkTo ? (
      <Link 
        to={props.disabled ? "#" : props.linkTo || "#"}
        className={buttonClass}
      >
        {buttonContent}
      </Link>
    ) : (
      <button disabled={props.disabled} className={buttonClass} onClick={props.onClick}>
        {buttonContent}
      </button>
    )
  );
}

export default Button;