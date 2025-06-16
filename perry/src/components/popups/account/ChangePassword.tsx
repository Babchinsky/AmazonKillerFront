import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordFormType, changePasswordFormSchema } from "../../../schemes/password-schema";
import Button from "../../buttons/Button";
import TextInput from "../../inputs/FormInput";
import accountPopupStyles from "./AccountPopup.module.scss";
import changePasswordStyle from "./ChangePassword.module.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../state/store";
import { changePassword } from "../../../state/account/account-slice";


interface ChangePasswordProps {
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

  const dispatch = useDispatch<AppDispatch>();
  
  const submitForm = async (data: ChangePasswordFormType) => {
    const resultAction = await dispatch(changePassword({
      currentPassword: data.password,
      newPassword: data.newPassword
    }));

    if (changePassword.fulfilled.match(resultAction)) {
      props.onClose();
    }
  };

  return (
    <>
      <div className={accountPopupStyles.overlay} onClick={() => props.onClose()}></div>

      <div className={accountPopupStyles.changeSettingsContainer}>
        <div className={accountPopupStyles.contentContainer}>
          <div className={accountPopupStyles.titleLeftContainer}>
            <h3 className={accountPopupStyles.title}>Enter password</h3>
            <hr className={`${accountPopupStyles.divider} divider`} />
          </div>

          <form className={changePasswordStyle.newPasswordFormContainer} onSubmit={handleSubmit(submitForm)} noValidate>
            <p className={`${accountPopupStyles.descriptionLeft} ${changePasswordStyle.descriptionLeft}`}>Firstly, enter your current password to confirm this is you.</p>

            <TextInput
              type="password"
              {...register("password")}
              isError={!!errors.password}
              errorMessage={errors.password?.message}
            />

            <div className={`${accountPopupStyles.titleLeftContainer} ${changePasswordStyle.titleLeftContainer}`}>
              <h3 className={`${accountPopupStyles.title} ${changePasswordStyle.title}`}>Change password</h3>
              <hr className={`${accountPopupStyles.divider} divider`} />
            </div>
            <p className={`${accountPopupStyles.descriptionLeft} ${changePasswordStyle.descriptionLeft}`}>Enter new password for your account.</p>

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

            <div className={accountPopupStyles.buttonsContainer}>
              <Button type="secondary" content="Cancel" onClick={() => props.onClose()} />
              <Button type="primary" content="Confirm" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;