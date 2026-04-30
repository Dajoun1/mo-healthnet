import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchAddressSuggestions } from "../services/addressValidation";

const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dob: "",
    ssn: "",
    confirmSsn: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSsn, setShowSsn] = useState(false);
  const [ssnDisplay, setSsnDisplay] = useState("");
  const [confirmSsnDisplay, setConfirmSsnDisplay] = useState("");
  const [ssnMismatch, setSsnMismatch] = useState(false);

  // Address autocomplete
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user) navigate("/applicant/dashboard", { replace: true });
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSsnChange = (e) => {
    const { name } = e.target;
    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
    let formatted = digits;
    if (digits.length > 5) formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
    else if (digits.length > 3) formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (name === "ssn") {
      setSsnDisplay(formatted);
      setFormData((prev) => {
        if (prev.confirmSsn) setSsnMismatch(digits !== prev.confirmSsn);
        return { ...prev, ssn: digits };
      });
    } else {
      setConfirmSsnDisplay(formatted);
      setFormData((prev) => {
        setSsnMismatch(digits.length > 0 && prev.ssn !== digits);
        return { ...prev, confirmSsn: digits };
      });
    }
    if (error) setError("");
  };

  const handleStreetChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, streetAddress: value }));
    setAutoFilled(false);
    if (error) setError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 3) { setShowDropdown(false); setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSuggestionLoading(true);
      const results = await fetchAddressSuggestions(value);
      setSuggestions(results);
      setShowDropdown(results.length > 0);
      setSuggestionLoading(false);
    }, 350);
  };

  const handleSelectSuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      streetAddress: suggestion.streetAddress,
      city: suggestion.city,
      state: suggestion.state,
      zipCode: suggestion.zipCode,
    }));
    setAutoFilled(true);
    setSuggestions([]);
    setShowDropdown(false);
    setError("");
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) { setError("Please enter a valid email address."); return false; }
    if (formData.password.length < 6) { setError("Password must be at least 6 characters."); return false; }
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); return false; }
    if (!formData.firstName.trim()) { setError("First name is required."); return false; }
    if (!formData.lastName.trim()) { setError("Last name is required."); return false; }
    if (!formData.dob) { setError("Date of birth is required."); return false; }
    if (!/^\d{9}$/.test(formData.ssn)) { setError("SSN must be exactly 9 digits."); return false; }
    if (formData.ssn !== formData.confirmSsn) { setError("SSNs do not match."); return false; }
    if (!formData.streetAddress.trim()) { setError("Street address is required."); return false; }
    if (!formData.city.trim()) { setError("City is required."); return false; }
    if (!formData.zipCode.trim() || !/^\d{5}$/.test(formData.zipCode.trim())) { setError("Valid 5-digit ZIP code is required."); return false; }
    if (!formData.state.trim() || formData.state.trim().toUpperCase() !== "MO") {
      setError("Only Missouri residents may apply. State must be MO."); return false;
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
        birthDate: formData.dob,
        ssn: formData.ssn,
        phone: formData.phone ? formData.phone.replace(/\D/g, "").slice(0, 10) : null,
        streetAddress: formData.streetAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim().toUpperCase(),
        zipCode: formData.zipCode.trim().slice(0, 5),
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

  const inputClass = "w-full px-4 py-2 text-sm border rounded-md border-slate-300 focus:outline-[#0078AE]";

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100 py-8">
      <div className="flex flex-col items-center w-full gap-4 p-8 m-6 bg-white rounded-lg shadow-md lg:w-1/3 md:w-1/2 sm:w-2/3">
        <h1 className="font-sans font-semibold opacity-70 text-xl">Missouri Medicaid - Create Account</h1>
        {error && (
          <div data-testid="error-message" className="w-full p-3 text-sm text-red-600 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">

          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
              <input data-testid="first-name-input" className={inputClass} type="text" name="firstName"
                placeholder="John" value={formData.firstName} onChange={handleChange} required disabled={loading} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name *</label>
              <input data-testid="last-name-input" className={inputClass} type="text" name="lastName"
                placeholder="Doe" value={formData.lastName} onChange={handleChange} required disabled={loading} />
            </div>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth *</label>
            <input data-testid="dob-input" className={inputClass} type="date" name="dob"
              value={formData.dob} onChange={handleChange} required disabled={loading} />
          </div>

          {/* SSN */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Social Security Number (SSN) *</label>
            <div className="relative">
              <input data-testid="ssn-input"
                className="w-full px-4 py-2 pr-10 text-sm border rounded-md border-slate-300 focus:outline-[#0078AE]"
                type={showSsn ? "text" : "password"} name="ssn" placeholder="123-45-6789"
                value={ssnDisplay} onChange={handleSsnChange} maxLength="11" inputMode="numeric" required disabled={loading} />
              <button type="button" onClick={() => setShowSsn((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                <i className={`fas ${showSsn ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              <i className="fas fa-shield-alt mr-1"></i>Your SSN is encrypted and never stored in plain text.
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm SSN *</label>
            <div className="relative">
              <input data-testid="confirm-ssn-input"
                className={`w-full px-4 py-2 pr-10 text-sm border rounded-md focus:outline-[#0078AE] ${ssnMismatch ? "border-red-400" : "border-slate-300"}`}
                type={showSsn ? "text" : "password"} name="confirmSsn" placeholder="123-45-6789"
                value={confirmSsnDisplay} onChange={handleSsnChange} maxLength="11" inputMode="numeric" required disabled={loading} />
              <button type="button" onClick={() => setShowSsn((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                <i className={`fas ${showSsn ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {ssnMismatch && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><i className="fas fa-times-circle"></i> SSNs do not match</p>}
            {!ssnMismatch && formData.confirmSsn.length === 9 && formData.ssn === formData.confirmSsn && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><i className="fas fa-check-circle"></i> SSNs match</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
            <input data-testid="email-input" className={inputClass} type="email" name="email"
              placeholder="name@example.com" value={formData.email} onChange={handleChange} required disabled={loading} />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password *</label>
            <input data-testid="password-input" className={inputClass} type="password" name="password"
              placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required minLength="6" disabled={loading} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password *</label>
            <input data-testid="confirm-password-input" className={inputClass} type="password" name="confirmPassword"
              placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required disabled={loading} />
          </div>

          {/* Missouri Address */}
          <div className="border-t border-gray-200 pt-3 mt-1">
            <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <i className="fas fa-map-marker-alt text-[#0078AE]"></i>
              Missouri Address *
            </p>
            <p className="text-xs text-gray-400 mb-2">
              Only Missouri residents may apply. Type to search or enter manually.
            </p>

            {/* Street with autocomplete */}
            <div className="relative mb-2" ref={dropdownRef}>
              <div className="relative">
                <input
                  className={`${inputClass} pr-8`}
                  type="text" name="streetAddress"
                  placeholder="Street Address"
                  value={formData.streetAddress}
                  onChange={handleStreetChange}
                  onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                  autoComplete="off"
                  required disabled={loading}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  {suggestionLoading
                    ? <i className="fas fa-spinner fa-spin"></i>
                    : autoFilled
                      ? <i className="fas fa-check-circle text-green-500"></i>
                      : <i className="fas fa-search"></i>}
                </span>
              </div>

              {showDropdown && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <li key={i} onMouseDown={() => handleSelectSuggestion(s)}
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-[#0078AE]/10 cursor-pointer flex items-center gap-2 border-b border-gray-100 last:border-0">
                      <i className="fas fa-map-marker-alt text-[#0078AE] text-xs flex-shrink-0"></i>
                      {s.displayLabel}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* City / State / ZIP — always visible and editable */}
            <div className="grid grid-cols-3 gap-2">
              <input className={inputClass} type="text" name="city" placeholder="City"
                value={formData.city} onChange={handleChange} required disabled={loading} />
              <input className={`${inputClass} uppercase`} type="text" name="state" placeholder="State (MO)"
                value={formData.state} onChange={handleChange} maxLength="2" required disabled={loading} />
              <input className={inputClass} type="text" name="zipCode" placeholder="ZIP"
                value={formData.zipCode} onChange={handleChange} maxLength="5" inputMode="numeric" required disabled={loading} />
            </div>

            {formData.state && formData.state.toUpperCase() !== "MO" && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <i className="fas fa-times-circle"></i> Only Missouri (MO) residents may apply
              </p>
            )}
            {formData.state && formData.state.toUpperCase() === "MO" && formData.city && formData.zipCode && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <i className="fas fa-check-circle"></i> Missouri address confirmed
              </p>
            )}
          </div>

          <button data-testid="submit-button" type="submit"
            className="w-full px-4 py-2 mt-2 text-white rounded-md bg-[#0078AE] hover:bg-[#005f8e] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <div className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{" "}
            <Link to="/signin" className="text-[#0078AE] hover:underline font-semibold">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Signup;

