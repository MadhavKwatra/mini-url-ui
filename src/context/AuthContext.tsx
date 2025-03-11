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

// Define action types
type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "LOADING" };

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
    default:
      return state;
  }
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

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
      console.log(response, "From logged In api called");
      const user = response.data;
      localStorage.setItem("token", user.token); // ✅ Store token in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN_SUCCESS", payload: { user, token: user.token } });
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: "LOADING" });
      const response = await authService.signup({ name, email, password });
      const user = response.data;
      localStorage.setItem("token", user.token); // ✅ Store token in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN_SUCCESS", payload: { user, token: user.token } });
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error instanceof Error ? error.message : "Signup failed",
      });
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
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
    [state]
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
