import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordFormType, forgotPasswordFormSchema } from "../../../schemes/password-schema";
import FormInput from "../../inputs/FormInput";
import Button from "../../buttons/Button";
import authenticationStyles from "./Authentication.module.scss";


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
    <form className={authenticationStyles.authFormContainer} onSubmit={handleSubmit(submitForm)} noValidate>
      <div className={authenticationStyles.authFormTopContainer}>
        <h3>Forgot password</h3>
        <p className={authenticationStyles.subtitle}>Enter your email to reset your password</p>
      </div>

      <div className={authenticationStyles.authFormMiddleContainer}>
        <FormInput
          type="email"
          {...register("email")}
          isError={!!errors.email}
          errorMessage={errors.email?.message}
        />
      </div>
    
      <div className={authenticationStyles.authFormBottomContainer}>
        <Button className={authenticationStyles.authButton} type="primary" content="Continue" />
      </div>
    </form>
  );
}

export default ForgotPasswordForm;