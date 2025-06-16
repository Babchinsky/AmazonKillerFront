import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpNameFormType, signUpNameFormSchema } from "../../../schemes/sign-up-schema";
import Button from "../../buttons/Button";
import TextInput from "../../inputs/FormInput";
import accountPopupStyles from "./AccountPopup.module.scss";
import changeNameStyle from "./ChangeName.module.scss";
import { changeName } from "../../../state/account/account-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../state/store";


interface ChangeNameProps {
  onClose: () => void;
}

function ChangeName(props: ChangeNameProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpNameFormType>({
    resolver: zodResolver(signUpNameFormSchema),
    mode: "onBlur"
  });

  const dispatch = useDispatch<AppDispatch>();

  const submitForm = async (data: SignUpNameFormType) => {
    const resultAction = await dispatch(changeName({ 
      firstName: data.firstName, 
      lastName: data.lastName 
    }));

    if (changeName.fulfilled.match(resultAction)) {
      props.onClose();
    }
  };

  return (
    <>
      <div className={accountPopupStyles.overlay} onClick={() => props.onClose()}></div>

      <div className={accountPopupStyles.changeSettingsContainer}>
        <div className={accountPopupStyles.contentContainer}>
          <div className={accountPopupStyles.titleLeftContainer}>
            <h3 className={accountPopupStyles.title}>Change name</h3>
            <hr className={`${accountPopupStyles.divider} divider`} />
          </div>

          <form className={changeNameStyle.newNameFormContainer} onSubmit={handleSubmit(submitForm)} noValidate>
            <TextInput
              type="text"
              title="First name"
              placeholder="Enter new first name"
              {...register("firstName")}
              isError={!!errors.firstName}
              errorMessage={errors.firstName?.message}
            />

            <TextInput
              type="text"
              title="Last name"
              placeholder="Enter new last name"
              {...register("lastName")}
              isError={!!errors.lastName}
              errorMessage={errors.lastName?.message}
            />

            <div className={accountPopupStyles.buttonsContainer}>
              <Button className="change-settings-button" type="secondary" content="Cancel" onClick={() => props.onClose()} />
              <Button className="change-settings-button" type="primary" content="Confirm" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChangeName;