import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, registerAndLogin } = useAuth();
  const [formData, setFormData] = useState({
    birthDate: "",
    ssn: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // On mount, resolve the user's email from auth context or localStorage fallback
  useEffect(() => {
    const emailFromContext = user?.username;
    const emailFromStorage = localStorage.getItem("pendingUserEmail");
    const email = emailFromContext || emailFromStorage;

    if (email) {
      setUserEmail(email);
    } else {
      // No authenticated user and no pending email — send back to signup
      navigate("/signup", { replace: true });
    }
  }, [navigate, user]);

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
    // Birth date validation
    if (!formData.birthDate) {
      setError("Birth date is required");
      return false;
    }

    // SSN validation (should be 9 digits)
    const ssnRegex = /^\d{9}$|^\d{3}-\d{2}-\d{4}$/;
    const cleanSSN = formData.ssn.replace(/-/g, "");
    if (!ssnRegex.test(cleanSSN)) {
      setError("SSN must be 9 digits (format: 123456789 or 123-45-6789)");
      return false;
    }

    // Phone validation (optional, but if provided should be valid)
    if (formData.phone && !/^\d{10}$|^\d{3}-\d{3}-\d{4}$/.test(formData.phone.replace(/-/g, ""))) {
      setError("Phone must be 10 digits (format: 1234567890 or 123-456-7890)");
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
      const cleanSSN = formData.ssn.replace(/-/g, "");
      const cleanPhone = formData.phone ? formData.phone.replace(/-/g, "") : "";

      const profileData = {
        email: userEmail,
        birthDate: formData.birthDate,
        ssn: cleanSSN,
        phone: cleanPhone || null,
      };

      // Call the complete-profile endpoint
      const response = await api.post("/auth/complete-profile", profileData);

      if (response.data.success) {
        setSuccess("Profile completed successfully! You can now create applications.");
        // Clear the pending email from localStorage
        localStorage.removeItem("pendingUserEmail");
        // Update the user's profileComplete flag in AuthContext + localStorage
        if (user) {
          registerAndLogin({ ...user, profileComplete: true, userId: user.id });
        }
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/applicant/dashboard", { replace: true });
        }, 2000);
      } else {
        setError(response.data.message || "Profile completion failed. Please try again.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Profile completion failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Allow users to skip for now (can complete later)
    localStorage.removeItem("pendingUserEmail");
    navigate("/applicant/dashboard", { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100 py-8">
      <div className="flex flex-col items-center w-full gap-4 p-8 m-6 bg-white rounded-lg shadow-md lg:w-1/3 md:w-1/2 sm:w-2/3">
        <h1 className="font-sans font-semibold opacity-70 text-xl">
          Complete Your Profile
        </h1>

        <p className="text-sm text-gray-600 text-center">
          We need a few more details to set up your account. You'll need to provide this information to apply for benefits.
        </p>

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
          {/* Birth Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Date of Birth *
            </label>
            <input
              data-testid="birth-date-input"
              className="w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#52acd6]"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Required for age verification</p>
          </div>

          {/* SSN */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Social Security Number (9 digits) *
            </label>
            <input
              data-testid="ssn-input"
              className="w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#52acd6]"
              type="text"
              name="ssn"
              placeholder="123456789 or 123-45-6789"
              value={formData.ssn}
              onChange={handleChange}
              required
              disabled={loading}
              maxLength="11"
            />
            <p className="text-xs text-gray-500 mt-1">Required for benefits verification</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone Number (Optional)
            </label>
            <input
              data-testid="phone-input"
              className="w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#52acd6]"
              type="tel"
              name="phone"
              placeholder="1234567890 or 123-456-7890"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              maxLength="12"
            />
            <p className="text-xs text-gray-500 mt-1">We may use this to contact you about your application</p>
          </div>

          <div className="flex gap-2 w-full mt-4">
            <button
              data-testid="submit-button"
              type="submit"
              className="flex-1 px-4 py-2 text-white rounded-md bg-[#0078AE] hover:bg-[#1a89bd] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              disabled={loading}
            >
              {loading ? "Completing..." : "Complete Profile"}
            </button>

            <button
              data-testid="skip-button"
              type="button"
              onClick={handleSkip}
              className="flex-1 px-4 py-2 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              disabled={loading}
            >
              Complete Later
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-2">
            You can complete this information later, but you'll need it to apply for benefits.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;




