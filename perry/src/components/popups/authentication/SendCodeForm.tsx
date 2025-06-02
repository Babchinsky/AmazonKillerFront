import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../state/store";
import { registerConfirm } from "../../../state/auth/auth-slice";
import { useForm } from "react-hook-form";
import SendCodeInput, { SendCodeInputHandle } from "../../inputs/SendCodeInput";
import TextButton from "../../buttons/Button";
import "./Authentication.scss";


interface SendCodeFormProps {
  email: string;
  deviceId: string;
  onContinue: () => void;
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

  const sendCodeInputRef = useRef<SendCodeInputHandle>(null);
  const [codeError, setCodeError] = useState(false);

  const submitCode = async () => {
    const code = sendCodeInputRef.current?.getCode() || "";

    if (code.length !== 6) {
      setCodeError(true);
      return;
    }

    try {
      const result = await dispatch(registerConfirm({ email: props.email, code, deviceId: props.deviceId }));

      if (registerConfirm.fulfilled.match(result)) {
        props.onContinue();
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
    <form className="auth-form-container" onSubmit={handleSubmit(submitCode)} noValidate>
      <div className="auth-form-top-container">
        <h3 className="title">Send code</h3>
        <p className="subtitle">Enter the code to confirm your email</p>
      </div>

      <div className="auth-form-middle-container">
        <SendCodeInput ref={sendCodeInputRef} isError={codeError} />
      </div> 
    
      <div className="auth-form-bottom-container">
        <TextButton className="auth-button" type={"primary"} content="Continue" />
      </div>
    </form>
  );
}

export default SendCodeForm;