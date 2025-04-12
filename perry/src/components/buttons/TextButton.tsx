import "./TextButton.scss";


interface TextButtonProps {
  type: "primary" | "secondary" | "tertiary" | "destructive";
	content: string;
}
  
function TextButton(props: TextButtonProps) {
  return (
    <button className={`text-button ${props.type}-text-button`}>{props.content}</button>
  );
}

export default TextButton;