import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpNameFormType, signUpNameFormSchema } from "../../schemes/sign-up-schema";
import TextInput from "../inputs/TextInput";
import TextButton from "../buttons/TextButton";
import "./Authentication.scss";


interface NameFormProps {
  onContinue: () => void;
}

function NameForm(props: NameFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpNameFormType>({
    resolver: zodResolver(signUpNameFormSchema),
    mode: "onBlur"
  });

  const submitForm = (data: SignUpNameFormType) => {
    props.onContinue();
  };

  return (
    <form className="auth-form-container" onSubmit={handleSubmit(submitForm)} noValidate>
      <div className="auth-form-top-container">
        <h3 className="title">Finishing touches</h3>
        <p className="subtitle">Enter your first and last name</p>
      </div>

      <div className="auth-form-middle-container">
        <TextInput
          type="text"
          title="First name"
          placeholder="Enter your first name"
          {...register("firstName")}
          isError={!!errors.firstName}
          errorMessage={errors.firstName?.message}
        />

        <TextInput
          type="text"
          title="Last name"
          placeholder="Enter your last name"
          {...register("lastName")}
          isError={!!errors.lastName}
          errorMessage={errors.lastName?.message}
        />
      </div>
    
      <div className="auth-form-bottom-container">
        <TextButton className="auth-button" type={"primary"} content="Create account" />
      </div>
    </form>
  );
}

export default NameForm;