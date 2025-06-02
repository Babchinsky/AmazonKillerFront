import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordFormType, forgotPasswordFormSchema } from "../../../schemes/password-schema";
import TextInput from "../../inputs/TextInput";
import TextButton from "../../buttons/Button";
import "./Authentication.scss";


interface ForgotPasswordFormProps {
  onContinue: () => void;
}

function ForgotPasswordForm(props: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    mode: "onBlur"
  });

  const submitForm = (data: ForgotPasswordFormType) => {
    props.onContinue();
  };
  
  return (
    <form className="auth-form-container" onSubmit={handleSubmit(submitForm)} noValidate>
      <div className="auth-form-top-container">
        <h3 className="title">Forgot password</h3>
        <p className="subtitle">Enter your email to reset your password</p>
      </div>

      <div className="auth-form-middle-container">
        <TextInput
          type="email"
          {...register("email")}
          isError={!!errors.email}
          errorMessage={errors.email?.message}
        />
      </div>
    
      <div className="auth-form-bottom-container">
        <TextButton className="auth-button" type={"primary"} content="Continue" />
      </div>
    </form>
  );
}

export default ForgotPasswordForm;