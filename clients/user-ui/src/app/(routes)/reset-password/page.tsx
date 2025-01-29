"use client";

import ResetPassword from "@/shared/Auth/ResetPassword";
import { useSearchParams } from "next/navigation";

function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('verify');

  return (
    <div className="flex justify-center items-center h-screen">
      <ResetPassword token={token || ""} />
    </div>
  )
}

export default ResetPasswordPage;
