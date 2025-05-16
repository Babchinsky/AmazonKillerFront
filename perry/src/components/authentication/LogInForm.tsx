import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogInFormType, logInFormSchema } from "../../schemes/log-in-schema";
import TextInput from "../inputs/TextInput";
import Checkbox from "../Checkbox";
import TextButton from "../buttons/TextButton";
import "./Authentication.scss";


interface LogInFormProps {
  onForgotPasswordClick: () => void;
  onLogIn: () => void;
  onSwitchAuthType: () => void;
}

function LogInForm(props: LogInFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormType>({
    resolver: zodResolver(logInFormSchema),
    mode: "onBlur"
  });

  const [staySignedIn, setStaySignedIn] = useState<boolean>(false);

  const submitForm = (data: LogInFormType) => {
    props.onLogIn();
  };

  return (
    <form className="auth-form-container" onSubmit={handleSubmit(submitForm)} noValidate>
      <div className="auth-form-top-container">
        <h3 className="title">Welcome back</h3>
        <p className="subtitle">Login into your account</p>
      </div>

      <div className="auth-form-middle-container">
        <TextInput
          type="email"
          {...register("email")}
          isError={!!errors.email}
          errorMessage={errors.email?.message}
        />

        <TextInput
          type="password"
          {...register("password")}
          isError={!!errors.password}
          errorMessage={errors.password?.message}
        />

        <div className="auth-options-container">
          <Checkbox
            label={<span className="stay-signed-in-label-checkbox">Stay signed in</span>}
            isChecked={staySignedIn}
            onChange={setStaySignedIn}
          />
          <button className="forgot-password-button" type="button" onClick={props.onForgotPasswordClick}>Forgot password?</button>
        </div>
      </div>
    
      <div className="auth-form-bottom-container">
        <TextButton className="auth-button" type={"primary"} content="Log in" />
        <div className="account-info-container">
          <p>Don’t have an account?</p>
          <button className="account-button" type="button" onClick={props.onSwitchAuthType}>Sign up</button>
        </div>
      </div>
    </form>
  );
}

export default LogInForm;