import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";

const SignUp = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, registerAndLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/applicant/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    // Confirm password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // First name validation
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        email: formData.email.toLowerCase(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        role: "Applicant",
      };

      const response = await authService.register(registrationData);

      if (response.success) {
        // Immediately authenticate the user so they stay logged in
        // through the complete-profile step and beyond.
        registerAndLogin(response);
        // Store email so CompleteProfile can send it to the backend
        localStorage.setItem("pendingUserEmail", formData.email.toLowerCase());
        navigate("/applicant/complete-profile", { replace: true });
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100 py-8">
      <div className="flex flex-col items-center w-full gap-4 p-8 m-6 bg-white rounded-lg shadow-md lg:w-1/3 md:w-1/2 sm:w-2/3">
        <h1 className="font-sans font-semibold opacity-70 text-xl">
          Missouri Medicaid - Create Account
        </h1>

        {error && (
          <div
            data-testid="error-message"
            className="w-full p-3 text-sm text-red-600 bg-red-100 rounded-md"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            data-testid="success-message"
            className="w-full p-3 text-sm text-green-600 bg-green-100 rounded-md"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email *
            </label>
            <input
              data-testid="email-input"
              className="w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#52acd6]"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password *
            </label>
            <input
              data-testid="password-input"
              className="w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#52acd6]"
              type="password"
              name="password"
              placeholder="Enter password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Confirm Password *
            </label>
            <input
              data-testid="confirm-password-input"
              className="w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#52acd6]"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              First Name *
            </label>
            <input
              data-testid="first-name-input"
              className="w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#52acd6]"
              type="text"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              data-testid="last-name-input"
              className="w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#52acd6]"
              type="text"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <span className="w-full my-2 text-xs text-[#9CA3AF] font-sm">
            Quick signup - we'll collect additional details before you submit an application.
          </span>

          <button
            data-testid="submit-button"
            type="submit"
            className="w-full px-4 py-2 text-white rounded-md bg-[#0078AE] hover:bg-[#1a89bd] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{" "}
            <Link to="/signin" className="text-[#0078AE] hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
