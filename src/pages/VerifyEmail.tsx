import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router";
import authService from "../services/authService";
import Navbar from "../components/layout/Navbar";
import Button from "../components/common/Button";
import FormError from "../components/common/FormError";
import toast from "react-hot-toast";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyEmail = async () => {
    if (!token) {
      setError("Invalid verification link.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await authService.verifyEmail(token);
      toast.success(response.message);

      toast.success("Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: Error | any) {
      console.log(err, "Error in Verify Email");
      setError(err.response?.data?.message || "Verification failed.");
      toast.error(err.response?.data?.message || "Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-6 bg-white shadow-md rounded-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verify Your Email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Thank you for signing up! To complete your registration, please
              verify your email address by clicking the button below.
            </p>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <Button
            onClick={handleVerifyEmail}
            isLoading={isVerifying}
            className="w-full"
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </Button>
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Didn’t receive the email? Check your spam folder
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Once verified, you can log in and start using your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
