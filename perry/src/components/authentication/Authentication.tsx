import { useState } from "react";
import { getCssVariable } from "../../utils/getCssVariable";
import { useBreakpoint } from "../../utils/useBreakpoint";
import AuthFormType from "../../types/authentication-form-type";
import LogInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";
import SendCodeForm from "./SendCodeForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import NameForm from "./NameForm";
import FinishSignUpForm from "./FinishSignUpForm";
import Close from "../../assets/icons/close.svg?react";
import ArrowLeft from "../../assets/icons/arrow-left.svg?react";
import bannerAuth from "../../assets/images/authentication/banner-authentication.png";
import "./Authentication.scss";


interface AuthenticationProps {
  type: "logIn" | "signUp";
  onClose: () => void;
}

function Authentication(props: AuthenticationProps) {
  const breakpointDesktop = parseInt(getCssVariable("--breakpoint-desktop"), 10);
  const isDesktop = useBreakpoint(breakpointDesktop);
  
  const [action, setAction] = useState<string>(props.type);
  const [activeForm, setActiveForm] = useState<AuthFormType>(props.type);
  const [prevForm, setPrevForm] = useState<AuthFormType>(props.type);
  const showBackButton = activeForm === "sendCode" || (!isDesktop && (activeForm === "forgotPassword" || activeForm === "resetPassword"));

  const [formHistory, setFormHistory] = useState<AuthFormType[]>([props.type]);

  const pushForm = (newForm: AuthFormType) => {
    setFormHistory((prev) => [...prev, newForm]);
    setActiveForm(newForm);
  };

  const clickBack = () => {
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
            onContinue={() => {
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
            onContinue={() => {
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
      <div className="auth-overlay" onClick={() => isDesktop && props.onClose()}></div>

      <div className="auth-container">
        <div className="auth-content-container">
          <button className="auth-close-button" onClick={props.onClose}>
            <Close className="close-icon" />
          </button>

          {showBackButton && (
            <button className="auth-back-button" onClick={clickBack}>
              <ArrowLeft className="arrow-left-icon" />
              <span>Back</span>
            </button>
          )}

          {renderForm()}
        </div>

        <img className="auth-banner-image" alt="Banner" src={bannerAuth} />
      </div>
    </>
  );
}

export default Authentication;