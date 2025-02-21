import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { REGISTER_RESTAURANT } from "@/graphql/actions/register.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import regions from "../../data/countrys/regions.json";
import district from "../../data/countrys/districts.json";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Eye, EyeOff } from "lucide-react";

const schema = z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirm_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    country: z.string().min(3, { message: "Select Country required" }),
    region: z.string().min(3, { message: "Select Region required" }),
    city: z.string().min(3, { message: "Select City required" }),
    phone_number: z
      .number()
      .min(10, { message: "Phone number must be at least 10 characters" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match!",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

function SignUp() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [avatarFile, setAvatarFile] = useState<object | null>(null);
  const [avatarBuffer, setAvatarBuffer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [loginRestaurantMutation, { loading }] =
    useMutation(REGISTER_RESTAURANT);

  const onSubmit = async (data: FormData) => {
    try {
      const { confirm_password, ...rest } = data;
      if (!avatarFile) {
        toast.error("Please upload your restaurant logo");
        return;
      }
      setIsLoading(true)
      const avatar = await handleUploadAvatar();
      const response = await loginRestaurantMutation({
        variables: { ...rest, picture:avatar },
      });
      toast.success(response.data?.registerRestaurant.message);
      reset();
      setIsLoading(false)
      setValue("country", "");
      setValue("region", "");
      setValue("city", "");
      setAvatarBuffer("");
    } catch (error) {
      setIsLoading(false)
      toast.error("Failed to register" + (error as Error).message);
    }
  };

  const handleAvatarBuffer = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setAvatarBuffer(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAvatar = async () => {
    try {
      const formData = new FormData();
      formData.append("file", avatarFile as Blob);
      const response = await fetch("/api/file-upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      toast.error("Failed to upload avatar" + (error as Error).message);
    } finally {
      setAvatarBuffer("");
    }
  };

  const handleRegionChange = (value: string) => {
    const selectedRegion = regions.find((region) => region.id === value);
    if (!selectedRegion) return;
    setSelectedRegion(value);
    setValue("region", selectedRegion.name_uz);
  };

  const filteredDistricts = district.filter(
    (d) => d.region_id === selectedRegion
  );

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto h-full ">
        <Image
          className="w-36 py-2"
          src="/imgs/logo.png"
          alt="logo"
          width={144}
          height={36}
        />
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex justify-center flex-col flex-wrap  items-center 400px:justify-between">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign up to your account
              </h1>
              <Label className="py-3">
                <Avatar className="w-20 h-20 cursor-pointer border">
                  <AvatarImage
                    src={avatarBuffer}
                    alt="Avatar"
                    className="h-full w-full"
                  />
                  <AvatarFallback>
                    <Camera className="text-[#636363]" />{" "}
                  </AvatarFallback>
                </Avatar>
                <Input
                  className="hidden"
                  type="file"
                  accept="jpg, jpeg, png"
                  onChange={handleAvatarBuffer}
                />
              </Label>
            </div>
            <form
              className="space-y-4 md:space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="w-full flex flex-col md:flex-row justify-between gap-2">
                <div className="w-full">
                  <Label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name of the restaurant
                  </Label>
                  <Input
                    {...register("name")}
                    type="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter your Restaurant name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="country"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Country
                  </Label>
                  <Select onValueChange={(value) => setValue("country", value)}>
                    <SelectTrigger className="w-full border bg-[#F9FAFB] text-[#646464]">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Uzbekistan">Uzbekistan</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-red-500 text-sm">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col md:flex-row justify-between gap-2">
                <div className="w-full">
                  <Label
                    htmlFor="region"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Region
                  </Label>
                  <Select onValueChange={handleRegionChange}>
                    <SelectTrigger className="w-full border bg-[#F9FAFB] text-[#646464]">
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent className="h-[30vh]">
                      {regions.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.name_uz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.region && (
                    <p className="text-red-500 text-sm">
                      {errors.region.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="city"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    City
                  </Label>
                  <Select onValueChange={(value) => setValue("city", value)}>
                    <SelectTrigger className="w-full border bg-[#F9FAFB] text-[#646464]">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent className="h-[30vh]">
                      {filteredDistricts.map((district) => (
                        <SelectItem key={district.id} value={district.name_uz}>
                          {district.name_uz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city && (
                    <p className="text-red-500 text-sm">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col md:flex-row justify-between gap-2">
                <div className="w-full">
                  <Label
                    htmlFor="phone_number"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone number
                  </Label>
                  <Input
                    value={getValues("phone_number")}
                    onChange={(e) =>
                      setValue("phone_number", Number(e.target.value))
                    }
                    onBlur={(e) =>
                      setValue("phone_number", Number(e.target.value))
                    }
                    type="number"
                    id="phone_number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </Label>
                  <Input
                    {...register("email")}
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col md:flex-row justify-between gap-2">
                <div className="w-full relative">
                  <Label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </Label>
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="password!@#123"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {showPassword ? (
                    <Eye
                      onClick={() => setShowPassword(!showPassword)}
                      className={
                        errors.password || errors.confirm_password
                          ? "absolute right-2 bottom-6 text-gray-600"
                          : "absolute right-2 bottom-1 text-gray-600"
                      }
                    />
                  ) : (
                    <EyeOff
                      onClick={() => setShowPassword(!showPassword)}
                      className={
                        errors.password || errors.confirm_password
                          ? "absolute right-2 bottom-6 text-gray-600"
                          : "absolute right-2 bottom-1 text-gray-600"
                      }
                    />
                  )}
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="w-full relative">
                  <Label
                    htmlFor="confirm_password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </Label>
                  <Input
                    {...register("confirm_password")}
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    placeholder="password!@#123"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {showConfirmPassword ? (
                    <Eye
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={
                        errors.password || errors.confirm_password
                          ? "absolute right-2 bottom-6 text-gray-600"
                          : "absolute right-2 bottom-1 text-gray-600"
                      }
                    />
                  ) : (
                    <EyeOff
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={
                        errors.password || errors.confirm_password
                          ? "absolute right-2 bottom-6 text-gray-600"
                          : "absolute right-2 bottom-1 text-gray-600"
                      }
                    />
                  )}
                  {errors.confirm_password && (
                    <p className="text-red-500 text-sm">
                      {errors.confirm_password.message}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                {(loading || isLoading) ? "Registering..." : "Sign Up"}
              </Button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium text-blue-600 dark:text-primary-500"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
