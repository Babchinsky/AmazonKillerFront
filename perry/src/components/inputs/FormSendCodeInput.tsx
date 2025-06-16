import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import formSendCodeInputStyles from "./FormSendCodeInput.module.scss";


export interface FormSendCodeInputHandle {
  getCode: () => string;
}

interface FormSendCodeInputProps {
  isError?: boolean;
  onSend: () => void;
  onSubmit?: (code: string) => void;
}

const FormSendCodeInput = forwardRef<FormSendCodeInputHandle, FormSendCodeInputProps>((props, ref) => {
  const codeLength = 6;
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    getCode: () => code.join(""),
  }));

  const [timer, setTimer] = useState<number>(0);
  const [hasSentCode, setHasSentCode] = useState<boolean>(false);

  const change = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < codeLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (newCode.every(char => char !== "") && props.onSubmit) {
      props.onSubmit(newCode.join(""));
    }
  };

  const keyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const sendCode = () => {
    if (!hasSentCode) {
      setHasSentCode(true);
      props.onSend();
    }

    setTimer(60);
  };

  const formatTime = (timerSeconds: number) => {
    const minutes = Math.floor(timerSeconds / 60).toString().padStart(1, "0");
    const seconds = (timerSeconds % 60).toString().padStart(2, "0");
    
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className={formSendCodeInputStyles.formSendCodeInputContainer}>
      <div className={formSendCodeInputStyles.inputContainer}>
        {code.map((value, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => change(index, e.target.value)}
            onKeyDown={(e) => keyDown(index, e)}
          />
        ))}
      </div>

      {props.isError && (
        <p className={formSendCodeInputStyles.errorMessage}>Incorrect code, try again</p>
      )}

      <button
        type="button"
        onClick={sendCode}
        disabled={timer > 0}
      >
        {timer > 0 ? `Resend code ${formatTime(timer)}` : hasSentCode ? "Resend code" : "Send code"}
      </button>
    </div>
  );
});

export default FormSendCodeInput;