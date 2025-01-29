import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { REGISTER_USER } from "@/graphql/actions/register.action";
import styles from "@/utils/style";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

interface RegisterProps {
  handleAuthType: (type: string) => void;
}

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phone_number: z
    .number()
    .min(12, "Phone number must be at least 12 characters long"),
});

type RegisterSchema = z.infer<typeof registerSchema>;

function Register({ handleAuthType }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [registerUserMutation, { loading }] = useMutation(REGISTER_USER);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const { data: registerData } = await registerUserMutation({
        variables: data,
      });

      localStorage.setItem(
        "activation_token",
        registerData?.register?.activation_token
      );
      toast.success("Please check your email for activation code!");
      handleAuthType("verification");
      reset();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="w-full h-full pt-2">
      <h1 className={styles.title}>Create your account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1 my-2">
          <Label htmlFor="name" className={styles.label}>
            Name
          </Label>
          <Input
            type="text"
            id="name"
            placeholder="John Doe"
            {...register("name")}
            className="w-full"
          />
          {errors.name && (
            <p className="text-red-500 text-[12px]">{errors.name.message}</p>
          )}
        </div>
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
          <Label htmlFor="phone_number" className={styles.label}>
            Phone Number
          </Label>
          <Input
            type="number"
            id="phone_number"
            placeholder="+998*********"
            {...register("phone_number", {
              valueAsNumber: true,
            })}
            className="w-full"
          />
          {errors.phone_number && (
            <p className="text-red-500 text-[12px]">
              {errors.phone_number.message}
            </p>
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
            <p className="text-red-500 text-[12px]">
              {errors.password.message}
            </p>
          )}
          {showPassword ? (
            <EyeIcon
              className={
                errors.password
                  ? "absolute right-2 bottom-6 z-10"
                  : "absolute right-2 bottom-1 z-10"
              }
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <EyeOffIcon
              className={
                errors.password
                  ? "absolute right-2 bottom-6 z-10"
                  : "absolute right-2 bottom-1 z-10"
              }
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <Button
            disabled={isSubmitting || loading}
            type="submit"
            className={`${styles.button} w-full !bg-blue-500 text-white`}
          >
            {isSubmitting || loading ? "Registering..." : "Register"}
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 mt-4">
          <h5 className="text-[16px] font-Poppins text-white">Or join width</h5>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="flex items-center gap-2 w-full border border-blue-500 hover:border-white/60"
            >
              <Image src="./google.svg" alt="google" width={25} height={25} />
              <p className="text-[16px] font-Poppins text-white">Google</p>
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex items-center gap-2 w-full border border-blue-500 hover:border-white/60"
            >
              <Image src="./facebook.svg" alt="apple" width={25} height={25} />
              <p className="text-[16px] font-Poppins text-white">Facebook</p>
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p>Already have an account?</p>
            <span
              onClick={() => handleAuthType("login")}
              className="text-blue-500 cursor-pointer"
            >
              Login
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
