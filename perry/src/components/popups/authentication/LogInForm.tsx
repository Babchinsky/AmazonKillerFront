import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogInFormType, logInFormSchema } from "../../../schemes/log-in-schema";
import TextInput from "../../inputs/TextInput";
import Checkbox from "../../Checkbox";
import TextButton from "../../buttons/Button";
import "./Authentication.scss";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../state/store";
import { login } from "../../../state/auth/auth-slice";


interface LogInFormProps {
  deviceId: string;
  onForgotPasswordClick: () => void;
  onLogIn: () => void;
  onSwitchAuthType: () => void;
}

function LogInForm(props: LogInFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormType>({
    resolver: zodResolver(logInFormSchema),
    mode: "onBlur"
  });

  const [staySignedIn, setStaySignedIn] = useState<boolean>(false);

  const submitForm = async (data: LogInFormType) => {
    const result = await dispatch(login({ ...data, deviceId: props.deviceId }));

    if (login.fulfilled.match(result)) {
      const { accessToken, refreshToken } = result.payload;

      if (staySignedIn) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      } 
      else {
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
      }

      props.onLogIn();
    } 
    else {
      console.error("Login error:", result.payload);
    }
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