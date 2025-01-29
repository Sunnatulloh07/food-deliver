import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import styles from "@/utils/style";
import { FORGOT_PASSWORD } from "@/graphql/actions/forgot-password.action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordSchema = z.infer<typeof formSchema>;

const ForgotPassword = ({
  handleAuthType,
}: {
  handleAuthType: (e: string) => void;
}) => {
  const [forgotPasswordMutation, { loading }] = useMutation(FORGOT_PASSWORD);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      const { data: forgotPasswordData } = await forgotPasswordMutation({
        variables: {
          email: data.email,
        },
      });
      toast.success(forgotPasswordData.forgotPassword.message);
      reset();
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message);
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Forgot your password?</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="py-3">
          <label className={`${styles.label}`}>Enter your Email</label>
          <Input
            {...register("email")}
            type="email"
            placeholder="loginmail@gmail.com"
            className={`${styles.input}`}
          />
          {errors.email && (
            <span className="text-red-500 block my-1 text-[12px]">
              {`${errors.email.message}`}
            </span>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || loading}
          className={`${styles.button} w-full !bg-blue-500 text-white`}
        >
          Submit
        </Button>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Or Go Back to
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => handleAuthType("login")}
          >
            Login
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default ForgotPassword;
