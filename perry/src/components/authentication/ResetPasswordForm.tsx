import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordFormType, resetPasswordFormSchema } from "../../schemes/password-schema";
import TextInput from "../inputs/TextInput";
import TextButton from "../buttons/TextButton";
import "./Authentication.scss";


interface ResetPasswordFormProps {
  onContinue: () => void;
}

function ResetPasswordForm(props: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: "onBlur"
  });

  const submitForm = (data: ResetPasswordFormType) => {
    props.onContinue();
  };

  return (
    <form className="auth-form-container" onSubmit={handleSubmit(submitForm)} noValidate>
      <div className="auth-form-top-container">
        <h3 className="title">Reset password</h3>
        <p className="subtitle">Set a new password for your account</p>
      </div>

      <div className="auth-form-middle-container">
        <TextInput
          type="password"
          title="New password"
          placeholder="Enter new password"
          {...register("newPassword")}
          isError={!!errors.newPassword}
          errorMessage={errors.newPassword?.message}
        />

        <TextInput
          type="password"
          title="Repeat password"
          placeholder="Repeat new password"
          {...register("repeatPassword")}
          isError={!!errors.repeatPassword}
          errorMessage={errors.repeatPassword?.message}
        />
      </div>
    
      <div className="auth-form-bottom-container">
        <TextButton className="auth-button" type={"primary"} content="Continue" />
      </div>
    </form>
  );
}

export default ResetPasswordForm;