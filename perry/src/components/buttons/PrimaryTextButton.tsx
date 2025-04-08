import "./PrimaryTextButton.scss";


interface PrimaryTextButtonProps {
	content: string;
}
  
function PrimaryTextButton(props: PrimaryTextButtonProps) {
  return (
    <>
      <button className="primary-text-button">
        <span>{props.content}</span>
      </button>
    </>
  );
}

export default PrimaryTextButton;