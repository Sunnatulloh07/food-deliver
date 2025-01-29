import { useEffect, useState } from "react";
import Login from "../shared/Auth/Login";
import Register from "../shared/Auth/Register";
import Verification from "@/shared/Auth/Verification";
import ForgotPassword from "@/shared/Auth/ForgotPassword";

interface AuthScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function AuthScreen({ open, setOpen }: AuthScreenProps) {
  const [authType, setAuthType] = useState("login");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <div onClick={handleClose} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 bg-opacity-50">
      <div className="w-[450px] bg-slate-900 rounded shadow-md p-4 border border-white/50">
        {authType === "login" ? (
          <Login handleAuthType={setAuthType} setOpen={setOpen} />
        ) : authType === "register" ? (
          <Register handleAuthType={setAuthType} />
        ) : authType === "verification" ? (
          <Verification handleAuthType={setAuthType} />
        ) : authType === "forgot-password" && (
          <ForgotPassword handleAuthType={setAuthType} />
        )}
      </div>
    </div>
  );
}

export default AuthScreen;
