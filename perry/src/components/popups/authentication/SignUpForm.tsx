import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { AppDispatch } from "../../../state/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormType, signUpFormSchema } from "../../../schemes/sign-up-schema";
import FormInput from "../../inputs/FormInput";
import Button from "../../buttons/Button";
import authenticationStyles from "./Authentication.module.scss";


interface SignUpFormProps {
  onContinue: (email: string, password: string) => void;
  onSwitchAuthType: () => void;
}

function SignUpForm(props: SignUpFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormType>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onBlur"
  });

  const [signUpError, setSignUpError] = useState<string | null>(null);

  const submitForm = async (data: SignUpFormType) => {
    props.onContinue(data.email, data.password);
  };
  
  return (
    <form className={authenticationStyles.authFormContainer} onSubmit={handleSubmit(submitForm)} noValidate>
      <div className={authenticationStyles.authFormTopContainer}>
        <h3>Create account</h3>
        <p className={authenticationStyles.subtitle}>Shop in the marketplace while traveling</p>
      </div>

      <div className={authenticationStyles.authFormMiddleContainer}>
        <FormInput
          type="email"
          title="Email"
          placeholder="Enter your email"
          {...register("email")}
          isError={!!errors.email}
          errorMessage={errors.email?.message}
        />

        <FormInput
          type="password"
          title="Password"
          placeholder="Create a password"
          {...register("password")}
          isError={!!errors.password}
          errorMessage={errors.password?.message}
        />

        <FormInput
          type="password"
          title="Confirm password"
          placeholder="Repeat your password"
          {...register("confirmPassword")}
          isError={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
        />
      </div> 
    
      <div className={authenticationStyles.authFormBottomContainer}>
        {signUpError && (
          <p className={authenticationStyles.errorMessage}>{signUpError}</p>
        )}

        <Button className={authenticationStyles.authButton} type="primary" content="Continue" />
        <div className={authenticationStyles.accountInfoContainer}>
          <p>Have an account?</p>
          <button type="button" onClick={props.onSwitchAuthType}>Log in</button>
        </div>
      </div>

      <p className={authenticationStyles.authLegalNotice}>By clicking “Continue”, you agree with <span className={authenticationStyles.highlight}>PERRY Terms and Conditions</span></p>
    </form>
  );
}

export default SignUpForm;