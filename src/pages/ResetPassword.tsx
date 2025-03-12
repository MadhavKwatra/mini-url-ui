import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "../schemas/authSchema";
import authService from "../services/authService";
import Navbar from "../components/layout/Navbar";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import FormError from "../components/common/FormError";
import toast from "react-hot-toast";

// TODO: Test this functionality
const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError(
        "Invalid or missing token. Please request a new password reset link."
      );
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.resetPassword({
        token,
        newPassword: data.password,
      });
      toast.success(response.message, { duration: 3000 });
      setSuccessMessage("Your password has been reset successfully.");

      // Navigate to login page after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.log(err, "Error in Reset Password");
      setError(
        err.response?.data?.message ||
          "There was an error resetting your password. The token may be invalid or expired."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle invalid or missing token
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Invalid Reset Link
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                The password reset link is invalid or has expired.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Set New Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please enter your new password below.
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
                  <p className="text-sm text-green-700 mt-1">
                    You'll be redirected to the login page in a moment...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="New password"
                {...register("password")}
                error={errors.password?.message}
              />
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />

              {error && <FormError error={error} />}

              <div>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading || !isValid}
                  className="w-full"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
