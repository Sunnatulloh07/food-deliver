"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { categories } from "@/configs/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LucideImagePlus, X } from "lucide-react";
import { uploadToImaege } from "@/utils/foodFileUpload";
import { useMutation } from "@apollo/client";
import { FOODS_CREATE } from "@/graphql/actions/foods.create.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  price: z.number(),
  estimatedPrice: z.number(),
  category: z.string().nonempty("Category is required"),
  images: z
    .array(
      z.object({
        image: z.string(),
        file: z.instanceof(File),
      })
    )
    .min(1, "At least one image is required"),
});

type FormData = z.infer<typeof formSchema>;

const CreateFood = () => {
  const [createFoodMutation, { loading }] = useMutation(FOODS_CREATE);
  const [handleUpload, setHandleUpload] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [],
      category: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setHandleUpload(true)
    try {
      const pictures = await uploadToImaege(data.images) as string[];
      const res = await createFoodMutation({
        variables: { ...data, images: pictures },
      });
      if (res.data?.createFoods.success) {
        toast.success(res.data?.createFoods.message);
        setHandleUpload(false);
        reset();
        router.push("/foods");
      }else{
        toast.error(res.data?.createFoods.message);
        setHandleUpload(false);
      }
    } catch (error) {
      toast.error((error as Error).message);
      setHandleUpload(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  // this is for selecting features
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );

      const newImages: { image: string; file: File }[] = [];

      for (const file of files) {
        const base64 = await convertFileToBase64(file);
        newImages.push({ image: base64, file });
      }

      setValue("images", [...(watch("images") || []), ...newImages]);
    }
  };

  // for drag and drop feature
  const handleImageDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      const newImages: { image: string; file: File }[] = [];

      for (const file of files) {
        const base64 = await convertFileToBase64(file);
        newImages.push({ image: base64, file });
      }

      setValue("images", [...(watch("images") || []), ...newImages]);
    }
  };

  // Helper function to convert a file to Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleEditedFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const newImages = [...watch("images")];
        newImages[index] = { image: base64, file };
        setValue("images", newImages);
      };
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = watch("images").filter((_, i) => i !== index);
    if (!newImages.length) {
      setValue("images", []);
    } else {
      setValue("images", newImages);
    }
  };

  

  return (
    <div className="w-full pb-10">
      <div className="md:w-[70%] w-full mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          <div className="py-2">
            <Label htmlFor="name">Enter Food Name</Label>
            <Input
              type="text"
              id="name"
              {...register("name")}
              className="mt-2 input"
              placeholder="BBQ Chicken"
            />
            {errors.name && (
              <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="py-2">
            <Label htmlFor="description">Enter Description</Label>
            <textarea
              id="description"
              rows={4}
              cols={25}
              {...register("description")}
              className="input !h-[unset] !mt-2"
              placeholder="BBQ Chicken with salad, rice, and fries with a side of soda."
            />
            {errors.description && (
              <p className="text-red-500  text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex items-center flex-wrap justify-between">
            <div className="w-[48%]">
              <Label htmlFor="price">Enter Food Price</Label>
              <Input
                type="number"
                id="price"
                {...register("price", {
                  valueAsNumber: true,
                })}
                className="input"
                placeholder="50"
              />
              {errors.price && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="w-[48%]">
              <Label htmlFor="estimatedPrice">Enter Food Estimated Price</Label>
              <Input
                type="number"
                id="estimatedPrice"
                {...register("estimatedPrice", {
                  valueAsNumber: true,
                })}
                className="input"
                placeholder="70"
              />
              {errors.estimatedPrice && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.estimatedPrice.message}
                </p>
              )}
            </div>
          </div>
          <div className="my-2">
            <Label htmlFor="category">Select Category</Label>
            <Select
              onValueChange={(value) =>
                setValue("category", value, { shouldValidate: true })
              }
              value={watch("category")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="h-[200px] overflow-y-scroll">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.category.message}
              </p>
            )}
          </div>
          <div className="my-2">
            <Label>Upload Images</Label>
            <div
              className={cn(
                "border border-[#999] rounded-[5px] p-4",
                dragging ? "border-dashed  border-blue-500" : ""
              )}
            >
              <Input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageFile}
                className="hidden"
              />
              {watch("images").length > 0 ? (
                <>
                  <div className="mb-2">
                    <div className="flex-wrap flex gap-2">
                      {/* image item */}
                      {watch("images").map((item, index) => (
                        <div
                          key={index}
                          className="relative min-w-0 mb-[.5rem] max-w-full"
                        >
                          <div>
                            <input type="file" className="hidden" />
                            <div className="border border-[#dce1e7] rounded-[8px] overflow-hidden w-full">
                              <div className="overflow-hidden relative w-full group">
                                <div className="w-[100px] h-[100px] relative rounded-md mr-2">
                                  <Image
                                    src={item.image}
                                    alt="image"
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                                <div className="h-full inset-0 absolute w-full bg-[#303030b4]  hidden group-hover:flex justify-center items-center">
                                  <Label
                                    htmlFor={`images-${index}`}
                                    className="m-auto bg-white border px-0.5 rounded-md flex text-[#000] hover:bg-[#696969] hover:text-white"
                                  >
                                    <span className="text-[12px] cursor-pointer">
                                      Edit
                                    </span>
                                    <Input
                                      type="file"
                                      className="hidden"
                                      id={`images-${index}`}
                                      name="images"
                                      onChange={(event) =>
                                        handleEditedFileChange(event, index)
                                      }
                                    />
                                  </Label>
                                </div>
                                <Button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute text-gray-500 hover:text-red-500 w-[20px] h-[20px] bg-white  right-[5px] top-[5px]  rounded-sm border"
                                >
                                  <X />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Label
                      htmlFor="images"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDrop}
                      onDrop={handleImageDrop}
                    >
                      <span
                        className="cursor-pointer py-[.6rem] px-2 border bg-blue-500 rounded-md flex text-center justify-center align-middle"
                      >
                        Add Image
                      </span>
                    </Label>
                    <Button
                      type="button"
                      onClick={() => setValue("images", [])}
                      className="py-1 px-2 border rounded-md text-red-600"
                    >
                      Delete all
                    </Button>
                  </div>
                </>
              ) : (
                <Label
                  htmlFor="images"
                  className="mb-2 cursor-pointer"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDrop}
                  onDrop={handleImageDrop}
                >
                  <div className="text-center">
                    <div className="mb-3 flex justify-center">
                      <LucideImagePlus className="text-gray-500 text-[2.5rem]" />
                    </div>
                    <p className="text-gray-500">Drag and drop files here or click to upload</p>
                  </div>
                </Label>
              )}
            </div>
            {errors.images && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.images.message}
              </p>
            )}
          </div>
          <Button className="mt-5 bg-blue-500 hover:bg-blue-600" type="submit" disabled={isSubmitting}>
            {(isSubmitting || loading )? "Creating..." : "Create"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
