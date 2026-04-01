import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/applicant/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (!formData.firstName.trim()) {
      setError("First name is required.");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required.");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      const result = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: "Applicant",
      });
      if (result?.success) {
        navigate("/applicant/dashboard", { replace: true });
      } else {
        setError(result?.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Unable to create account. Please try again later.");
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
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
            <input
              data-testid="first-name-input"
              className="w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#0078AE]"
              type="text"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name *</label>
            <input
              data-testid="last-name-input"
              className="w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#0078AE]"
              type="text"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
            <input
              data-testid="email-input"
              className="w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#0078AE]"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password *</label>
            <input
              data-testid="password-input"
              className="w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#0078AE]"
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password *</label>
            <input
              data-testid="confirm-password-input"
              className="w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#0078AE]"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <button
            data-testid="submit-button"
            type="submit"
            className="w-full px-4 py-2 mt-2 text-white rounded-md bg-[#0078AE] hover:bg-[#005f8e] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
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
export default Signup;

