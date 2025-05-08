import { Link } from "react-router";
import "./TextButton.scss";


interface TextButtonProps {
  className?: string;
  type: "primary" | "secondary" | "tertiary" | "destructive";
	content: string;
  linkTo?: string;
  onClick?: () => void;
}

function TextButton(props: TextButtonProps) {
  const buttonClass = `text-button ${props.type}-text-button ${props.className || ""} ${props.linkTo ? "link" : ""}`.trim();

  return (
    props.linkTo ? (
      <Link className={buttonClass} to={props.linkTo}>
        {props.content}
      </Link>
    ) : (
      <button className={buttonClass} onClick={props.onClick}>
        {props.content}
      </button>
    )
  );
}

export default TextButton;