import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogInFormType, logInFormSchema } from "../../../schemes/log-in-schema";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../state/store";
import { login } from "../../../state/auth/auth-slice";
import FormInput from "../../inputs/FormInput";
import Checkbox from "../../checkboxes/Checkbox";
import Button from "../../buttons/Button";
import authenticationStyles from "./Authentication.module.scss";


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

  const [loginError, setLoginError] = useState<string | null>(null);
  const [staySignedIn, setStaySignedIn] = useState<boolean>(false);

  const submitForm = async (data: LogInFormType) => {
    const result = await dispatch(login({ ...data, deviceId: props.deviceId }));

    if (login.fulfilled.match(result)) {
      const { accessToken, refreshToken } = result.payload;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      props.onLogIn();
    } 
    else {
      if ((result.payload as any)?.status === 401) {
        setLoginError("Invalid email or password");
      } 
      else {
        setLoginError("Something went wrong. Please try again");
      }
    }
  };

  return (
    <form className={authenticationStyles.authFormContainer} onSubmit={handleSubmit(submitForm)} noValidate>
      <div className={authenticationStyles.authFormTopContainer}>
        <h3>Welcome back</h3>
        <p className={authenticationStyles.subtitle}>Login into your account</p>
      </div>

      <div className={authenticationStyles.authFormMiddleContainer}>
        <FormInput
          type="email"
          {...register("email")}
          isError={!!errors.email}
          errorMessage={errors.email?.message}
        />

        <FormInput
          type="password"
          {...register("password")}
          isError={!!errors.password}
          errorMessage={errors.password?.message}
        />

        <div className={authenticationStyles.authOptionsContainer}>
          <Checkbox
            label={<span className={authenticationStyles.staySignedInLabelCheckbox}>Stay signed in</span>}
            isChecked={staySignedIn}
            onChange={setStaySignedIn}
          />
          <button type="button" onClick={props.onForgotPasswordClick}>Forgot password?</button>
        </div>
      </div>
    
      <div className={authenticationStyles.authFormBottomContainer}>
        {loginError && (
          <p className={authenticationStyles.errorMessage}>{loginError}</p>
        )}

        <Button className={authenticationStyles.authButton} type="primary" content="Log in" />
        <div className={authenticationStyles.accountInfoContainer}>
          <p>Don’t have an account?</p>
          <button type="button" onClick={props.onSwitchAuthType}>Sign up</button>
        </div>
      </div>
    </form>
  );
}

export default LogInForm;