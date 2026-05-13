import { Link } from "react-router-dom";

const PersonalInfo = ({ formData, onChange, onBlur, errors, touched }) => {
  const inputClass = (fieldName) => `
    w-full px-5 py-3.5 rounded-2xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200
    ${errors[fieldName] && touched[fieldName]
      ? "border-red-400 focus:border-red-500 ring-4 ring-red-500/20"
      : "border-gray-200 focus:border-[#0078AE] focus:ring-4 focus:ring-[#0078AE]/20"}
    focus:outline-none
  `;

  const readOnlyClass = `
    w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed
  `;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  };

  // Fields that came back empty from DB (old account) should be editable
  const missingAddress = !formData.streetAddress;
  const missingDob = !formData.birthDate;

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          <i className="fas fa-user text-[#0078AE]"></i>
          Personal Information
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Pre-filled from your account.{" "}
          <Link to="/applicant/support" className="text-[#0078AE] hover:underline">
            Contact support to update.
          </Link>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
            <input type="text" value={formData.firstName || ""} readOnly className={readOnlyClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
            <input type="text" value={formData.lastName || ""} readOnly className={readOnlyClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date of Birth {missingDob && <span className="text-red-500">*</span>}
            </label>
            {missingDob ? (
              <>
                <input
                  id="birthDate"
                  type="date"
                  name="birthDate"
                  value={formData.birthDate || ""}
                  onChange={onChange}
                  onBlur={() => onBlur("birthDate")}
                  className={inputClass("birthDate")}
                />
                {errors.birthDate && touched.birthDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
                )}
                <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                  <i className="fas fa-exclamation-triangle"></i> Not on file — please enter
                </p>
              </>
            ) : (
              <input type="text" value={formatDate(formData.birthDate)} readOnly className={readOnlyClass} />
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-envelope text-[#0078AE] mr-2"></i>Email
            </label>
            <input type="text" value={formData.email || ""} readOnly className={readOnlyClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div>
            <label htmlFor="householdSize" className="block text-sm font-semibold text-gray-700 mb-2">
              Household Size <span className="text-red-500">*</span>
            </label>
            <input
              id="householdSize" type="number" name="householdSize"
              value={formData.householdSize || ""} onChange={onChange}
              onBlur={() => onBlur("householdSize")} min="1"
              className={inputClass("householdSize")} placeholder="Number of family members"
            />
            {errors.householdSize && touched.householdSize && (
              <p className="text-red-500 text-sm mt-2">{errors.householdSize}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-phone text-[#0078AE] mr-2"></i>Phone Number
            </label>
            <input
              id="phone" type="tel" name="phone"
              value={formData.phone || ""} onChange={onChange}
              onBlur={() => onBlur("phone")}
              className={inputClass("phone")} placeholder="(555) 555-5555"
            />
          </div>
        </div>
      </div>

      {/* Missouri Residency */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          <i className="fas fa-map-marker-alt text-[#0078AE]"></i>
          Missouri Residency
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          {missingAddress ? "Your address was not found on file. Please enter it below." : "Verified at registration."}
        </p>

        {missingAddress ? (
          <div className="space-y-3">
            <div>
              <input
                type="text" name="streetAddress" placeholder="Street Address"
                value={formData.streetAddress || ""} onChange={onChange}
                onBlur={() => onBlur("streetAddress")} className={inputClass("streetAddress")}
              />
              {errors.streetAddress && touched.streetAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  type="text" name="city" placeholder="City"
                  value={formData.city || ""} onChange={onChange}
                  onBlur={() => onBlur("city")} className={inputClass("city")}
                />
                {errors.city && touched.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <input
                  type="text" name="state" placeholder="State" maxLength="2"
                  value={formData.state || ""} onChange={onChange}
                  onBlur={() => onBlur("state")} className={inputClass("state")}
                />
                {errors.state && touched.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>
              <div>
                <input
                  type="text" name="zipCode" placeholder="ZIP" maxLength="5"
                  value={formData.zipCode || ""} onChange={onChange}
                  onBlur={() => onBlur("zipCode")} className={inputClass("zipCode")}
                />
                {errors.zipCode && touched.zipCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-yellow-600 flex items-center gap-1">
              <i className="fas fa-exclamation-triangle"></i>
              Address not on file — please enter your Missouri address
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <input type="text" value={formData.streetAddress || ""} readOnly className={readOnlyClass} />
            <div className="grid grid-cols-3 gap-3">
              <input type="text" value={formData.city || ""} readOnly className={readOnlyClass} />
              <input type="text" value={formData.state || ""} readOnly className={readOnlyClass} />
              <input type="text" value={formData.zipCode || ""} readOnly className={readOnlyClass} />
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2">
              <i className="fas fa-check-circle text-green-600"></i>
              <p className="text-sm text-green-700 font-medium">Missouri residency verified at account creation</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-[#0078AE]/5 to-[#0078AE]/10 rounded-2xl p-4 flex items-start gap-3">
        <i className="fas fa-lock text-[#0078AE] mt-0.5"></i>
        <div>
          <p className="text-sm font-semibold text-gray-700">Secure & Encrypted</p>
          <p className="text-xs text-gray-600">Your identity information is protected.</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;

