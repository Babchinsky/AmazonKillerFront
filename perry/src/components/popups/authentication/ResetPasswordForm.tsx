import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordFormType, resetPasswordFormSchema } from "../../../schemes/password-schema";
import FormInput from "../../inputs/FormInput";
import Button from "../../buttons/Button";
import authenticationStyles from "./Authentication.module.scss";


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
    <form className={authenticationStyles.authFormContainer} onSubmit={handleSubmit(submitForm)} noValidate>
      <div className={authenticationStyles.authFormTopContainer}>
        <h3>Reset password</h3>
        <p className={authenticationStyles.subtitle}>Set a new password for your account</p>
      </div>

      <div className={authenticationStyles.authFormMiddleContainer}>
        <FormInput
          type="password"
          title="New password"
          placeholder="Enter new password"
          {...register("newPassword")}
          isError={!!errors.newPassword}
          errorMessage={errors.newPassword?.message}
        />

        <FormInput
          type="password"
          title="Repeat password"
          placeholder="Repeat new password"
          {...register("repeatPassword")}
          isError={!!errors.repeatPassword}
          errorMessage={errors.repeatPassword?.message}
        />
      </div>
    
      <div className={authenticationStyles.authFormBottomContainer}>
        <Button className={authenticationStyles.authButton} type="primary" content="Continue" />
      </div>
    </form>
  );
}

export default ResetPasswordForm;