import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import styles from "@/utils/style";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RESET_PASSWORD } from "@/graphql/actions/reset-password.action";
import { EyeIcon, EyeOffIcon, ShieldEllipsis } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match!",
  path: ["confirmPassword"],
});

type ResetPasswordSchema = z.infer<typeof formSchema>;

const ResetPassword = ({ token }: { token: string }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPasswordMutation, { loading }] = useMutation(RESET_PASSWORD);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      const { data: resetPasswordData } = await resetPasswordMutation({
        variables: {
          token: token,
          password: data.password,
        },
      });
      toast.success(resetPasswordData.resetPassword.message);
      reset();
      setTimeout(() => {
        alert("Password reset successful. The page will now close.");
        window.close();
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="w-[450px] bg-slate-900 rounded shadow-md p-4 border border-white/50">
      <h1 className={`${styles.title}`}>Reset your password</h1>
      <div className="w-full flex items-center justify-center py-4">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <ShieldEllipsis size={40} className="text-white" />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1 relative my-2">
          <label className={`${styles.label}`}>New Password</label>
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className={`${styles.input}`}
          />
          {errors.password && (
            <span className="text-red-500 block my-1 text-[12px]">
              {`${errors.password.message}`}
            </span>
          )}
          {
            showPassword ? (
              <EyeIcon className={errors.password ? "absolute right-2 bottom-9 z-10" : "absolute right-2 bottom-1 z-10"} onClick={() => setShowPassword(!showPassword)} />
            ) : (
              <EyeOffIcon className={errors.password ? "absolute right-2 bottom-9 z-10" : "absolute right-2 bottom-1 z-10"} onClick={() => setShowPassword(!showPassword)} />
            )
          }
        </div>
        <div className="flex flex-col gap-1 relative my-2">
          <label className={`${styles.label}`}>Confirm New Password</label>
          <Input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className={`${styles.input}`}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 block my-1 text-[12px]">
              {`${errors.confirmPassword.message}`}
            </span>
          )}
          {
            showConfirmPassword ? (
              <EyeIcon className={errors.confirmPassword ? "absolute right-2 bottom-9 z-10" : "absolute right-2 bottom-1 z-10"} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
            ) : (
              <EyeOffIcon className={errors.confirmPassword ? "absolute right-2 bottom-9 z-10" : "absolute right-2 bottom-1 z-10"} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
            )
          }
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || loading}
          className={`${styles.button} w-full !bg-blue-500 text-white`}
        >
          Submit
        </Button>
        {/* <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Or Go Back to
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </h5> */}
        <br />
      </form>
    </div>
  );
};

export default ResetPassword;
