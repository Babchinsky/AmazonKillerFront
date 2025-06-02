import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordFormType, changePasswordFormSchema } from "../../../schemes/password-schema";
import TextButton from "../../buttons/Button";
import TextInput from "../../inputs/TextInput";
import "./ChangeSettings.scss";
import "./ChangePassword.scss";


interface ChangePasswordProps {
  onChange: () => void;
  onClose: () => void;
}

function ChangePassword(props: ChangePasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordFormSchema),
    mode: "onBlur"
  });

  const submitForm = (data: ChangePasswordFormType) => {
    //
  };

  return (
    <>
      <div className="change-settings-overlay" onClick={() => props.onClose()}></div>

      <div className="change-settings-container">
        <div className="change-settings-content-container">
          <div className="left-title-container">
            <h3 className="title">Enter password</h3>
            <hr className="divider" />
          </div>

          <form className="new-password-form-container" onSubmit={handleSubmit(submitForm)} noValidate>
            <p className="left-description">Firstly, enter your current password to confirm this is you.</p>
           
            <TextInput
              type="password"
              {...register("password")}
              isError={!!errors.password}
              errorMessage={errors.password?.message}
            />

            <div className="left-title-container">
              <h3 className="title">Change password</h3>
              <hr className="divider" />
            </div>
            <p className="left-description">Enter new password for your account.</p>

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
          </form>

          <div className="change-settings-buttons-container">
            <TextButton className="change-settings-button" type="secondary" content="Cancel" onClick={() => props.onClose()} />
            <TextButton className="change-settings-button" type="primary" content="Confirm" />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;