import TextButton from "../buttons/TextButton";
import "./Authentication.scss";


interface FinishSignUpFormProps {
  onContinue: () => void;
}

function FinishSignUpForm(props: FinishSignUpFormProps) {
  return (
    <div className="finish-auth-form-container">
      <div className="auth-form-top-container">
        <h3 className="title">Congratulations!</h3>
        <p className="subtitle">The registration was completed</p>
      </div>
    
      <div className="auth-form-bottom-container">
        <TextButton className="auth-button" type={"primary"} content="Let’s start shopping" onClick={props.onContinue} />
      </div>
    </div>
  );
}

export default FinishSignUpForm;