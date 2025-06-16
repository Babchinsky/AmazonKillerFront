import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { AppDispatch } from "../../../state/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpNameFormType, signUpNameFormSchema } from "../../../schemes/sign-up-schema";
import { registerComplete } from "../../../state/auth/auth-slice";
import FormInput from "../../inputs/FormInput";
import Button from "../../buttons/Button";
import authenticationStyles from "./Authentication.module.scss";


interface NameFormProps {
  email: string;
  code: string;
  deviceId: string;
  onContinue: () => void;
}

function NameForm(props: NameFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpNameFormType>({
    resolver: zodResolver(signUpNameFormSchema),
    mode: "onBlur"
  });

  const submitForm = async (data: SignUpNameFormType) => {
    try {
      await dispatch(
        registerComplete({
          email: props.email,
          code: props.code,
          firstName: data.firstName,
          lastName: data.lastName,
          deviceId: props.deviceId
        })
      ).unwrap();

      props.onContinue();
    } 
    catch (error: any) {
      alert(`Error: ${error.message ?? JSON.stringify(error)}`);
    }
  };

  return (
    <form className={authenticationStyles.authFormContainer} onSubmit={handleSubmit(submitForm)} noValidate>
      <div className={authenticationStyles.authFormTopContainer}>
        <h3>Finishing touches</h3>
        <p className={authenticationStyles.subtitle}>Enter your first and last name</p>
      </div>

      <div className={authenticationStyles.authFormMiddleContainer}>
        <FormInput
          type="text"
          title="First name"
          placeholder="Enter your first name"
          {...register("firstName")}
          isError={!!errors.firstName}
          errorMessage={errors.firstName?.message}
        />

        <FormInput
          type="text"
          title="Last name"
          placeholder="Enter your last name"
          {...register("lastName")}
          isError={!!errors.lastName}
          errorMessage={errors.lastName?.message}
        />
      </div>
    
      <div className={authenticationStyles.authFormBottomContainer}>
        <Button className={authenticationStyles.authButton} type="primary" content="Create account" />
      </div>
    </form>
  );
}

export default NameForm;