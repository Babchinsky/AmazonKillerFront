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
  const textButtonClass = `text-button ${props.type}-text-button ${props.className || ""} ${props.linkTo ? "link" : ""}`.trim();

  return (
    props.linkTo ? (
      <Link className={textButtonClass} to={props.linkTo}>
        {props.content}
      </Link>
    ) : (
      <button className={textButtonClass} onClick={props.onClick}>
        {props.content}
      </button>
    )
  );
}

export default TextButton;