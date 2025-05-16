import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormType, signUpFormSchema } from "../../schemes/sign-up-schema";
import TextInput from "../inputs/TextInput";
import TextButton from "../buttons/TextButton";
import "./Authentication.scss";


interface SignUpFormProps {
  onContinue: () => void;
  onSwitchAuthType: () => void;
}

function SignUpForm(props: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormType>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onBlur"
  });

  const submitForm = (data: SignUpFormType) => {
    props.onContinue();
  };

  return (
    <form className="auth-form-container" onSubmit={handleSubmit(submitForm)} noValidate>
      <div className="auth-form-top-container">
        <h3 className="title">Create account</h3>
        <p className="subtitle">Shop in the marketplace while traveling</p>
      </div>

      <div className="auth-form-middle-container">
        <TextInput
          type="email"
          title="Email"
          placeholder="Enter your email"
          {...register("email")}
          isError={!!errors.email}
          errorMessage={errors.email?.message}
        />

        <TextInput
          type="password"
          title="Password"
          placeholder="Create a password"
          {...register("password")}
          isError={!!errors.password}
          errorMessage={errors.password?.message}
        />

        <TextInput
          type="password"
          title="Confirm password"
          placeholder="Repeat your password"
          {...register("confirmPassword")}
          isError={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
        />
      </div> 
    
      <div className="auth-form-bottom-container">
        <TextButton className="auth-button" type={"primary"} content="Continue" />
        <div className="account-info-container">
          <p>Have an account?</p>
          <button className="account-button" type="button" onClick={props.onSwitchAuthType}>Log in</button>
        </div>
      </div>

      <p className="auth-legal-notice">By clicking “Continue”, you agree with <span className="highlight">PERRY Terms and Conditions</span></p>
    </form>
  );
}

export default SignUpForm;