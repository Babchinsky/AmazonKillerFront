import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordFormType, changePasswordFormSchema } from "../../../schemes/password-schema";
import Button from "../../buttons/Button";
import FormInput from "../../inputs/FormInput";
import FormSendCodeInput from "../../inputs/FormSendCodeInput";
import accountPopupStyles from "./AccountPopup.module.scss";
import changeEmailStyle from "./ChangeEmail.module.scss";


interface ChangeEmailProps {
  email: string;
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
      <div className={accountPopupStyles.overlay} onClick={() => props.onClose()}></div>

      <div className={accountPopupStyles.changeSettingsContainer}>
        <div className={accountPopupStyles.contentContainer}>
          <div className={accountPopupStyles.titleLeftContainer}>
            <h3 className={accountPopupStyles.title}>Change email</h3>
            <hr className={`${accountPopupStyles.divider} divider`} />
          </div>

          <form className={changeEmailStyle.newEmailFormContainer} onSubmit={handleSubmit(submitForm)} noValidate>
            <p className={`${accountPopupStyles.descriptionLeft} ${changeEmailStyle.descriptionLeft}`}>Your current email is {props.email}.</p>
            <p className={`${accountPopupStyles.descriptionLeft} ${changeEmailStyle.descriptionLeft}`}>
              To change it, enter a new email, then click “Send code” and enter it in corresponding prompt.
            </p>
           
            <FormInput
              type="password"
              {...register("password")}
              isError={!!errors.password}
              errorMessage={errors.password?.message}
            />

            <div className={changeEmailStyle.sendCodeContainer}>
              <FormSendCodeInput isError={false} onSend={() => {}} />
            </div> 
          </form>

          <div className={accountPopupStyles.buttonsContainer}>
            <Button type="secondary" content="Cancel" onClick={() => props.onClose()} />
            <Button type="primary" content="Confirm" />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangeEmail;