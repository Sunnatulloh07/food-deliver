import { Button } from "@/components/ui/button";
import { ACTIVATE_USER } from "@/graphql/actions/activate.action";
import styles from "@/utils/style";
import { useMutation } from "@apollo/client";
import { ShieldCheck } from "lucide-react";
import { FC, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type Props = {
  handleAuthType: (route: string) => void;
};

const Verification: FC<Props> = ({ handleAuthType }) => {
  const [ActivateUser, { loading }] = useMutation(ACTIVATE_USER);
  const [invalidError, setInvalidError] = useState(false);

  const [verifyNumber, setVerifyNumber] = useState("");

  const verificationHandler = async () => {
    const activationToken = localStorage.getItem("activation_token");

    if (verifyNumber.length !== 4) {
      setInvalidError(true);
      return;
    } else {
      const data = {
        activationToken,
        activationCode: verifyNumber,
      };
      try {
        const { data: resData } = await ActivateUser({
          variables: data,
        });
        localStorage.removeItem("activation_token");
        toast.success(resData?.activateUser.message);
        handleAuthType("login");
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Verify Your Account</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <ShieldCheck size={40} className="text-white" />
        </div>
      </div>
      <br />
      <br />
      <div className="m-auto flex items-center justify-around">
        <InputOTP
          maxLength={4}
          value={verifyNumber}
          onChange={(value) => setVerifyNumber(value.replace(/\D/g, ""))}
          onFocus={() => setInvalidError(false)}
        >
          <InputOTPGroup>
            <InputOTPSlot
              index={0}
              className={`w-12 h-12 text-[18px] border border-white rounded-md ${
                invalidError ? "shake border-red-500" : "border-white"
              }`}
            />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot
              index={1}
              className={`w-12 h-12 text-[18px] border border-white rounded-md ${
                invalidError ? "shake border-red-500" : "border-white"
              }`}
            />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot
              index={2}
              className={`w-12 h-12 text-[18px] border border-white rounded-md ${
                invalidError ? "shake border-red-500" : "border-white"
              }`}
            />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot
              index={3}
              className={`w-12 h-12 text-[18px] border border-white rounded-md ${
                invalidError ? "shake border-red-500" : "border-white"
              }`}
            />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <br />
      <br />
      <div className="w-full flex justify-center">
        <Button
          className={`${styles.button} text-white hover:bg-blue-700`}
          disabled={loading}
          onClick={verificationHandler}
        >
          Verify OTP
        </Button>
      </div>
      <br />
      <h5 className="text-center pt-4 font-Poppins text-[14px] text-white">
        Go back to sign in?
        <span
          className="text-[#2190ff] pl-1 cursor-pointer"
          onClick={() => handleAuthType("login")}
        >
          Sign in
        </span>
      </h5>
    </div>
  );
};

export default Verification;
