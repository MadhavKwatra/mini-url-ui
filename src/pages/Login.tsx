import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../schemas/authSchema";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import FormError from "../components/common/FormError";

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        const from = (location.state as any)?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      }, 1500);
    }

    // Clear any previous errors when component mounts
    clearError();
  }, [isAuthenticated, navigate, location, clearError]);

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Log in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                to="/signup"
                className="font-medium text-primary-600 hover:text-primary-500 text-lg"
              >
                create a new account
              </Link>
            </p>
          </div>
          <FormError error={error} />
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
              autoComplete="current-password"
              {...register("password")}
              error={errors.password?.message}
            />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                disabled={isLoading || !isValid}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
