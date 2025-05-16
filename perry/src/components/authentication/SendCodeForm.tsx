import SendCodeInput from "../inputs/SendCodeInput";
import TextButton from "../buttons/TextButton";
import "./Authentication.scss";


interface SendCodeFormProps {
  onContinue: () => void;
}

function SendCodeForm(props: SendCodeFormProps) {
  return (
    <form className="auth-form-container" noValidate>
      <div className="auth-form-top-container">
        <h3 className="title">Send code</h3>
        <p className="subtitle">Enter the code to confirm your email</p>
      </div>

      <div className="auth-form-middle-container">
        <SendCodeInput isError={true} />
      </div> 
    
      <div className="auth-form-bottom-container">
        <TextButton className="auth-button" type={"primary"} content="Continue" onClick={props.onContinue} />
      </div>
    </form>
  );
}

export default SendCodeForm;