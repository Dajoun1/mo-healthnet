import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { type, value } = e.target;
    setFormData({
      ...formData,
      [type === "password" ? "password" : "email"]: value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(formData);
      console.log("Login successful:", response);
      navigate("/dashboard"); // Using React Router navigation
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <div className="flex flex-col items-center w-full gap-4 p-8 m-6 bg-white rounded-lg shadow-md lg:w-1/3 md:w-1/2 sm:w-2/3">
        <h1 className="font-sans opacity-60">Applicant Login</h1>

        {error && (
          <div className="w-full p-3 text-sm text-red-600 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2">
          <input
            className="w-full px-5 py-2 mt-2 text-sm border rounded-md border-slate-300 focus:outline-custom-[#1196d4]"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            className="w-full px-5 py-2 mt-2 text-sm border rounded-md border-slate-300 focus:outline-custom-[#1196d4]"
            type="password"
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
