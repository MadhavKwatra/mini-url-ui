import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "../schemas/authSchema";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import FormError from "../components/common/FormError";

const Signup: React.FC = () => {
  const { signup, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }

    // Clear any previous errors when component mounts
    clearError();
  }, [isAuthenticated, navigate, clearError]);

  const onSubmit = async (data: SignupFormData) => {
    await signup(data.name, data.email, data.password);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 text-lg"
              >
                log in to your existing account
              </Link>
            </p>
          </div>
          <FormError error={error} />
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="name"
              type="text"
              label="Full name"
              placeholder="Full name"
              autoComplete="name"
              {...register("name")}
              error={errors.name?.message}
            />
            <Input
              id="email"
              type="email"
              label="Email address"
              placeholder="Email address"
              autoComplete="email"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              autoComplete="new-password"
              {...register("password")}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              disabled={isLoading || !isValid}
            >
              {isLoading ? "Signing up..." : "Create account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
