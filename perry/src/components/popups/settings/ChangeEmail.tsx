import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordFormType, changePasswordFormSchema } from "../../../schemes/password-schema";
import TextButton from "../../buttons/Button";
import TextInput from "../../inputs/TextInput";
import "./ChangeSettings.scss";
import "./ChangeEmail.scss";
import SendCodeInput from "../../inputs/SendCodeInput";


interface ChangeEmailProps {
  onChange: () => void;
  onClose: () => void;
}

function ChangeEmail(props: ChangeEmailProps) {
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
            <h3 className="title">Change email</h3>
            <hr className="divider" />
          </div>

          <form className="new-email-form-container" onSubmit={handleSubmit(submitForm)} noValidate>
            <p className="left-description">Your current email is johndoe@gmail.com.</p>
            <p className="left-description">
              To change it, enter a new email, then click “Send code” and enter it in corresponding prompt.
            </p>
           
            <TextInput
              type="password"
              {...register("password")}
              isError={!!errors.password}
              errorMessage={errors.password?.message}
            />

            <div className="new-email-send-code-container">
              <SendCodeInput isError={false} />
            </div> 
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

export default ChangeEmail;