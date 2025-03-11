import React, { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "../schemas/authSchema";
import authService from "../services/authService";
import Navbar from "../components/layout/Navbar";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import FormError from "../components/common/FormError";

// TODO: Test this functionality
const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      await authService.forgotPassword(data.email);
      setSuccessMessage(
        "If an account with this email exists, we have sent instructions to reset your password."
      );
    } catch (err) {
      // We don't show specific errors for security reasons
      setSuccessMessage(
        "If an account with this email exists, we have sent instructions to reset your password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {successMessage ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {successMessage}
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      Return to login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="rounded-md shadow-sm -space-y-px">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>

              {error && <FormError error={error} />}

              <div>
                <Button type="submit" isLoading={isLoading}>
                  Send reset instructions
                </Button>
              </div>

              <div className="flex items-center justify-center">
                <Link
                  to="/login"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
