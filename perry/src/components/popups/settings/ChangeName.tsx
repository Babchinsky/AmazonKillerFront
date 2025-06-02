import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpNameFormType, signUpNameFormSchema } from "../../../schemes/sign-up-schema";
import TextButton from "../../buttons/Button";
import TextInput from "../../inputs/TextInput";
import "./ChangeSettings.scss";
import "./ChangeName.scss";


interface ChangeNameProps {
  onChange: () => void;
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

  const submitForm = (data: SignUpNameFormType) => {
    //
  };

  return (
    <>
      <div className="change-settings-overlay" onClick={() => props.onClose()}></div>

      <div className="change-settings-container">
        <div className="change-settings-content-container">
          <div className="left-title-container">
            <h3 className="title">Change name</h3>
            <hr className="divider" />
          </div>

          <form className="new-name-form-container" onSubmit={handleSubmit(submitForm)} noValidate>
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

export default ChangeName;