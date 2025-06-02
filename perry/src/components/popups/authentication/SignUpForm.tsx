import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormType, signUpFormSchema } from "../../../schemes/sign-up-schema";
import TextInput from "../../inputs/TextInput";
import TextButton from "../../buttons/Button";
import "./Authentication.scss";

import { AppDispatch } from "../../../state/store";
import { useDispatch } from "react-redux";
import { registerStart } from "../../../state/auth/auth-slice";


interface SignUpFormProps {
  onContinue: (email: string) => void;
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

  const submitForm = async (data: SignUpFormType) => {
    try {
      const result = await dispatch(registerStart(data));
      // const result = await dispatch(registerStart({ email: data.email, password: data.password })).unwrap();
      // console.log(data.email);

      // console.log(result.payload);

      if (registerStart.fulfilled.match(result)) {
        // console.log(result.payload);

        props.onContinue(data.email);
      }
    } 
    catch (error: any) {
      alert(`Error: ${error.message ?? JSON.stringify(error)}`);
    }
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