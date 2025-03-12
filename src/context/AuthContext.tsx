import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { AuthState, User } from "../types/auth.types";
import authService from "../services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

// Define action types
type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "LOADING" }
  | { type: "STOP_LOADING" };

// Context type definition
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "LOADING":
      return {
        ...state,
        isLoading: true,
      };
    case "STOP_LOADING":
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const userJson = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);

          dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "LOADING" });
      const response = await authService.login({ email, password });
      if (response.status !== 200) {
        throw new Error(response?.message || "Login failed");
      }

      const user = response.data;

      dispatch({ type: "LOGIN_SUCCESS", payload: { user, token: user.token } });
      toast.success("Login successful!", { duration: 3000 });
      toast.loading("Redirecting to Dashboard...", { duration: 2000 });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: Error | any) {
      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        errorMessage = error.response.data?.message || "Invalid credentials.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      dispatch({
        type: "AUTH_ERROR",
        payload: errorMessage,
      });
      toast.error(errorMessage, { duration: 3000 });
    } finally {
      dispatch({ type: "STOP_LOADING" });
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: "LOADING" });
      const response = await authService.signup({ name, email, password });
      const user = response.data;
      if (!response || response.status !== 201) {
        throw new Error(response?.message || "Signup failed");
      }
      toast.success(
        response.message + "! Please check your email to verify your account",
        { duration: 3000 }
      );
      toast.loading("Redirecting to login page...", { duration: 3000 });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: Error | any) {
      console.log(error, "Signup error");
      let errorMessage = "Signup failed. Please try again.";

      if (error.response) {
        errorMessage = error.response.data?.message || "Something went wrong.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      dispatch({
        type: "AUTH_ERROR",
        payload: errorMessage,
      });
      toast.error(errorMessage, { duration: 3000 });
    } finally {
      dispatch({ type: "STOP_LOADING" });
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    toast.success("Logged out successfully", { duration: 3000 });
    dispatch({ type: "LOGOUT" });
  };

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, [dispatch]);

  // Context value
  const value = useMemo(
    () => ({
      ...state,
      login,
      signup,
      logout,
      clearError,
    }),
    [state, login, signup, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
