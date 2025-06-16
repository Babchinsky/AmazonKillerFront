import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { getCssVariable } from "../../../utils/getCssVariable";
import { useBreakpoint } from "../../../utils/useBreakpoint";
import AuthFormType from "../../../types/authentication-form-type";
import LogInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";
import SendCodeForm from "./SendCodeForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import NameForm from "./NameForm";
import FinishSignUpForm from "./FinishSignUpForm";
import BannerAuthImage from "../../../assets/images/authentication/banner-authentication.png";
import CloseIcon from "../../../assets/icons/close.svg?react";
import ArrowLeftIcon from "../../../assets/icons/arrow-left.svg?react";
import authenticationStyles from "./Authentication.module.scss";


interface AuthenticationProps {
  onClose: () => void;
}

function Authentication(props: AuthenticationProps) {
  const breakpointDesktop = parseInt(getCssVariable("--breakpoint-desktop"), 10);
  const isDesktop = useBreakpoint(breakpointDesktop);

  const authType = useSelector((state: RootState) => state.auth.authType);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const deviceId = localStorage.getItem("deviceId") ?? "";

  const [action, setAction] = useState<string>(authType);
  const [activeForm, setActiveForm] = useState<AuthFormType>(authType);
  const [formHistory, setFormHistory] = useState<AuthFormType[]>([authType]);
  
  useEffect(() => {
    setAction(authType);
    setActiveForm(authType);
    setFormHistory([authType]);
  }, [authType]);
  
  const showBackButton = activeForm === "sendCode" || (!isDesktop && (activeForm === "forgotPassword" || activeForm === "resetPassword"));

  const pushForm = (newForm: AuthFormType) => {
    setFormHistory((prev) => [...prev, newForm]);
    setActiveForm(newForm);
  };

  const goBack = () => {
    setFormHistory((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      
      const newHistory = prev.slice(0, -1);
      setActiveForm(newHistory[newHistory.length - 1]);

      return newHistory;
    });
  };

  const renderForm = () => {
    switch (activeForm) {
      case "logIn":
        return (
          <LogInForm
            deviceId={deviceId}
            onForgotPasswordClick={() => {
              pushForm("forgotPassword");
            }}
            onLogIn={() => props.onClose()}
            onSwitchAuthType={() => {
              setAction("signUp");
              setActiveForm("signUp");
              setFormHistory(["signUp"]);
            }}
          />
        );

      case "signUp":
        return (
          <SignUpForm
            onContinue={(email: string, password: string) => {
              setEmail(email);
              setPassword(password);
              pushForm("sendCode");
            }}
            onSwitchAuthType={() => {
              setAction("logIn");
              setActiveForm("logIn");
              setFormHistory(["logIn"]);
            }}
          />
        );

      case "forgotPassword":
        return (
          <ForgotPasswordForm
            onContinue={() => {
              pushForm("sendCode");
            }}
          />
        );

      case "sendCode":
        return (
          <SendCodeForm
            email={email}
            password={password}
            onContinue={(code: string) => {
              setVerificationCode(code);

              if (action === "signUp") {
                pushForm("name");
              }
              else {
                pushForm("resetPassword");
              }
            }}
          />
        );

      case "resetPassword":
        return (
          <ResetPasswordForm onContinue={() => props.onClose()} />
        );

      case "name":
        return (
          <NameForm
            email={email}
            code={verificationCode}
            deviceId={deviceId}
            onContinue={() => {
              setActiveForm("finishSignUp");
            }}
          />
        );

      case "finishSignUp":
        return (
          <FinishSignUpForm onContinue={() => props.onClose()} />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className={authenticationStyles.overlay} onClick={() => isDesktop && props.onClose()}></div>

      <div className={authenticationStyles.authContainer}>
        <div className={authenticationStyles.contentContainer}>
          <button className={authenticationStyles.authCloseButton} onClick={props.onClose}>
            <CloseIcon className={authenticationStyles.closeIcon} />
          </button>

          {showBackButton && (
            <button className={authenticationStyles.authBackButton} onClick={goBack}>
              <ArrowLeftIcon className={authenticationStyles.arrowLeftIcon} />
              <span>Back</span>
            </button>
          )}

          {renderForm()}
        </div>

        <img alt="Banner" src={BannerAuthImage} />
      </div>
    </>
  );
}

export default Authentication;