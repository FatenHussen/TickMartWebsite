declare module "react-otp-input" {
  import * as React from "react";

  export interface OTPInputProps {
    value: string;
    onChange: (value: string) => void;
    numInputs?: number;
    inputType?: string;
    shouldAutoFocus?: boolean;
    containerStyle?: string;
    renderInput?: (
      props: React.InputHTMLAttributes<HTMLInputElement>
    ) => React.ReactNode;
  }

  const OTPInput: React.FC<OTPInputProps>;
  export default OTPInput;
}
