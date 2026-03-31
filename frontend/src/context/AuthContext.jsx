import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing user on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Called after a successful registration response.
   * Builds a user object from the registration payload, persists it to
   * localStorage (same shape as login), and hydrates AuthContext state so
   * the user is immediately authenticated without a second login round-trip.
   */
  const registerAndLogin = (registrationResponse) => {
    const user = {
      id: registrationResponse.userId,
      username: registrationResponse.email,
      role: registrationResponse.role || "Applicant",
      firstName: registrationResponse.firstName,
      lastName: registrationResponse.lastName,
      profileComplete: registrationResponse.profileComplete ?? false,
    };
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
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
    registerAndLogin,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
