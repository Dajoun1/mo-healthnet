import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const normalizeRole = (role) => (role || "").toString().trim().toLowerCase();

const getDashboardRouteForRole = (role) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "applicant") return "/applicant/dashboard";
  if (normalizedRole === "caseworker" || normalizedRole === "employee") {
    return "/caseworker/dashboard";
  }
  if (normalizedRole === "admin") return "/";

  return "/";
};

const Signin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getDashboardRouteForRole(user?.role), { replace: true });
    }
  }, [isAuthenticated, user?.role, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData);
      const backendSuccess = result?.data?.success;
      const isLoginSuccessful =
        result?.success === true &&
        (backendSuccess === undefined || backendSuccess === true);

      if (isLoginSuccessful) {
        const userRole =
          result?.data?.user?.role ??
          result?.data?.role ??
          result?.data?.userRole ??
          user?.role;

        navigate(getDashboardRouteForRole(userRole), { replace: true });
      } else {
        setError(
          result?.error ||
            result?.data?.message ||
            "Login failed. Please check your email and password and try again."
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Login failed. Please check your email and password and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <div className="flex flex-col items-center w-full gap-4 p-8 m-6 bg-white rounded-lg shadow-md lg:w-1/3 md:w-1/2 sm:w-2/3">
        <h1 className="font-sans font-semibold opacity-70">
          Missouri Medicaid Login
        </h1>

        {error && (
          <div
            data-testid="error-message"
            className="w-full p-3 text-sm text-red-600 bg-red-100 rounded-md"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2">
          <input
            data-testid="email-input"
            className="w-full px-5 py-2 mt-2 text-sm border rounded-md border-slate-300 focus:outline-[#52acd6]"
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            data-testid="password-input"
            className="w-full px-5 py-2 mt-2 text-sm border rounded-md border-slate-300 focus:outline-[#52acd6]"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            minLength="6"
          />

          <span className="w-full my-1 text-xs text-[#9CA3AF] font-sm">
            Sign in to begin or continue your <br className="my-2" />
            Missouri Medicaid application.
          </span>

          <button
            data-testid="submit-button"
            type="submit"
            className="w-full px-4 py-2 text-white rounded-md bg-[#0078AE] hover:bg-[#1a89bd] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
