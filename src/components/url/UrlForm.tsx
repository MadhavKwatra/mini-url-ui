import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUrlSchema, CreateUrlFormData } from "../../schemas/authSchema";
import Button from "../common/Button";
import Input from "../common/Input";
import FormError from "../common/FormError";
import { ShortUrl } from "../../types/url.types";

interface UrlFormProps {
  onSubmit: (data: CreateUrlFormData) => Promise<ShortUrl>;
  isLoading: boolean;
  error: string | null;
}

const UrlForm: React.FC<UrlFormProps> = ({ onSubmit, isLoading, error }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUrlFormData>({
    resolver: zodResolver(createUrlSchema),
  });

  const handleFormSubmit = async (data: CreateUrlFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (err) {
      // Error is handled by the parent component
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Shorten a URL</h2>
      <FormError error={error} />
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Input
          label="URL to shorten"
          placeholder="https://example.com/long-url"
          {...register("originalUrl")}
          error={errors.originalUrl?.message}
        />

        {/* TODO: Implement backend for this */}
        <Input
          label="Custom alias (optional)"
          placeholder="my-custom-url"
          {...register("customAlias")}
          error={errors.customAlias?.message}
        />
        <Button type="submit" isLoading={isLoading} className="w-full">
          Create Short URL
        </Button>
      </form>
    </div>
  );
};

export default UrlForm;
