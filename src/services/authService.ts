import api from "../utils/axios";
import {
  LoginCredentials,
  SignupCredentials,
  ResetPasswordRequest,
  User,
} from "../types/auth.types";

export const authService = {
  /**
   * Register a new user
   */
  signup: async (
    credentials: SignupCredentials
  ): Promise<{ data: User; message: string; status: number }> => {
    const response = await api.post("/auth/sign-up", credentials);

    return { ...response.data, status: response.status };
  },

  /**
   * Log in a user
   */
  login: async (
    credentials: LoginCredentials
  ): Promise<{ data: User; message: string; status: number }> => {
    const response = await api.post("/auth/log-in", credentials);
    return { ...response.data, status: response.status };
  },

  /**
   * Verify user email
   */
  verifyEmail: async (
    token: string
  ): Promise<{ message: string; status: number }> => {
    const response = await api.post("/auth/verify-email", { token });
    return { ...response.data, status: response.status };
  },

  /**
   * Get the current logged-in user's profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  /**
   * Request a password reset
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<{ message: string }> => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  /**
   * Log out the current user (client-side only)
   */
  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;
