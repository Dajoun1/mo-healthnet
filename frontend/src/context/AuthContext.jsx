// AuthContext.jsx - Add debug logging
import React, { createContext, useState, useContext } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = authService.getCurrentUser();
    console.log("Stored user from localStorage:", storedUser);
    return storedUser || null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      console.log("Login response:", response);
      setUser(response.user);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Unable to sign in. Please try again later.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      await authService.register(userData);
      const response = await authService.login({
        email: userData.email,
        password: userData.password,
      });
      setUser(response.user);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Unable to create account. Please try again later.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
