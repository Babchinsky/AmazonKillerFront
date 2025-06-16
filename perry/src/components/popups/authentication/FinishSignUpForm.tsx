import Button from "../../buttons/Button";
import authenticationStyles from "./Authentication.module.scss";


interface FinishSignUpFormProps {
  onContinue: () => void;
}

function FinishSignUpForm(props: FinishSignUpFormProps) {
  return (
    <div className={authenticationStyles.finishAuthFormContainer}>
      <div className={authenticationStyles.authFormTopContainer}>
        <h3>Congratulations!</h3>
        <p className={authenticationStyles.subtitle}>The registration was completed</p>
      </div>
    
      <div className={authenticationStyles.authFormBottomContainer}>
        <Button className={authenticationStyles.authButton} type="primary" content="Let’s start shopping" onClick={props.onContinue} />
      </div>
    </div>
  );
}

export default FinishSignUpForm;