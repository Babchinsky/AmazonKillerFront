import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../state/store";
import { registerConfirm, registerStart } from "../../../state/auth/auth-slice";
import { useForm } from "react-hook-form";
import { FormSendCodeInputHandle } from "../../inputs/FormSendCodeInput";
import FormSendCodeInput from "../../inputs/FormSendCodeInput";
import Button from "../../buttons/Button";
import authenticationStyles from "./Authentication.module.scss";


interface SendCodeFormProps {
  email: string;
  password: string;
  onContinue: (code: string) => void;
}

function SendCodeForm(props: SendCodeFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur"
  });

  const sendCodeInputRef = useRef<FormSendCodeInputHandle>(null);
  const [codeError, setCodeError] = useState(false);

  const sendCode = async () => {
    try {
      await dispatch(registerStart({ email: props.email, password: props.password }));
    } 
    catch (err) {
      console.error("Failed to resend code", err);
    }
  };

  const submitCode = async () => {
    const code = sendCodeInputRef.current?.getCode() || "";

    if (code.length !== 6) {
      setCodeError(true);
      return;
    }

    try {
      const result = await dispatch(registerConfirm({ email: props.email, code }));

      if (registerConfirm.fulfilled.match(result)) {
        props.onContinue(code);
      }
      else {
        setCodeError(true);
      }
    } 
    catch (error: any) {
      setCodeError(true);
    }
  };

  return (
    <form className={authenticationStyles.finishAuthFormContainer} onSubmit={handleSubmit(submitCode)} noValidate>
      <div className={authenticationStyles.authFormTopContainer}>
        <h3>Send code</h3>
        <p className={authenticationStyles.subtitle}>Enter the code to confirm your email</p>
      </div>

      <div className={authenticationStyles.authFormMiddleContainer}>
        <FormSendCodeInput ref={sendCodeInputRef} isError={codeError} onSend={sendCode} />
      </div> 
    
      <div className={authenticationStyles.authFormBottomContainer}>
        <Button className={authenticationStyles.authButton} type="primary" content="Continue" />
      </div>
    </form>
  );
}

export default SendCodeForm;