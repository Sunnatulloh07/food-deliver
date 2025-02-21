import styles from "@/utils/style";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/graphql/actions/login.action";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';

interface LoginProps {
  handleAuthType: (type: string) => void;
  setOpen: (open: boolean) => void;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginSchema = z.infer<typeof loginSchema>;

function Login({ handleAuthType, setOpen }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const [loginUserMutation, { loading }] = useMutation(LOGIN_USER);

  const onSubmit = async (data: LoginSchema) => {
    try {
      const { data: loginData } = await loginUserMutation({
        variables: data,
      });
      localStorage.setItem("user", JSON.stringify(loginData?.login?.user));
      reset();
      toast.success("Login successfully!");
      window.location.reload();
      setOpen(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
  };

  return (
    <div className="w-full h-full pt-2">
      <h1 className={styles.title}>Login to your account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1 my-2">
          <Label htmlFor="email" className={styles.label}>
            Email
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="login@gmail.com"
            {...register("email")}
            className="w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-[12px]">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 relative my-2">
          <Label htmlFor="password" className={styles.label}>
            Password
          </Label>
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="password@!#%"
            {...register("password")}
            className="w-full"
          />
          {errors.password && (
            <p className="text-red-500 text-[12px]">{errors.password.message}</p>
          )}
          {
            showPassword ? (
              <EyeIcon className={errors.password ? "absolute right-2 bottom-6 z-10" : "absolute right-2 bottom-1 z-10"} onClick={() => setShowPassword(!showPassword)} />
            ) : (
              <EyeOffIcon className={errors.password ? "absolute right-2 bottom-6 z-10" : "absolute right-2 bottom-1 z-10"} onClick={() => setShowPassword(!showPassword)} />
            )
          }
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <span
            onClick={() => handleAuthType("forgot-password")}
            className={`${styles.navLink} text-blue-500 !text-[14px] text-right cursor-pointer`}
          >
            Forgot password?
          </span>
          <Button type="submit" className={`${styles.button} w-full !bg-blue-500 text-white`} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 mt-4">
          <h5 className="text-[16px] font-Poppins text-white">Or join width</h5>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="flex items-center gap-2 w-full border border-blue-500 hover:border-white/60"
              onClick={handleGoogleLogin}
            >
              <Image src="google.svg" alt="google" width={25} height={25} />
              <p className="text-[16px] font-Poppins text-white">Google</p>
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex items-center gap-2 w-full border border-blue-500 hover:border-white/60"
              onClick={handleGithubLogin}
            >
              <Image src="github.svg" alt="github" width={30} height={30}/>
              <p className="text-[16px] font-Poppins text-white">Github</p>
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p>Don&apos;t have an account?</p>
            <span onClick={() => handleAuthType("register")} className="text-blue-500 cursor-pointer">
              Register
          </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
