const PersonalInfo = ({ formData, onChange, onBlur, errors, touched }) => {
  const inputClass = (fieldName) => `
    w-full px-5 py-3.5 rounded-2xl border-2 bg-white/50 backdrop-blur-sm
    transition-all duration-200
    ${
      errors[fieldName] && touched[fieldName]
        ? "border-red-400 focus:border-red-500 ring-4 ring-red-500/20"
        : "border-gray-200 focus:border-[#0078AE] focus:ring-4 focus:ring-[#0078AE]/20"
    }
    focus:outline-none
  `;

  const readOnlyClass = `
    w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100
    bg-gray-50 text-gray-500 cursor-not-allowed
  `;

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-user text-[#0078AE]"></i>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              readOnly
              className={readOnlyClass}
            />
            <p className="text-xs text-gray-400 mt-1">From your account</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              readOnly
              className={readOnlyClass}
            />
            <p className="text-xs text-gray-400 mt-1">From your account</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={onChange}
              onBlur={() => onBlur("dob")}
              className={inputClass("dob")}
            />
            {errors.dob && touched.dob && (
              <p className="text-red-500 text-sm mt-2">{errors.dob}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Household Size <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="householdSize"
              value={formData.householdSize || ""}
              onChange={onChange}
              onBlur={() => onBlur("householdSize")}
              min="1"
              className={inputClass("householdSize")}
              placeholder="Number of family members"
            />
            {errors.householdSize && touched.householdSize && (
              <p className="text-red-500 text-sm mt-2">{errors.householdSize}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last 4 Digits of SSN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ssnLast4"
              value={formData.ssnLast4 || ""}
              onChange={onChange}
              onBlur={() => onBlur("ssnLast4")}
              maxLength="4"
              pattern="\d*"
              className={inputClass("ssnLast4")}
              placeholder="####"
            />
            {errors.ssnLast4 && touched.ssnLast4 && (
              <p className="text-red-500 text-sm mt-2">{errors.ssnLast4}</p>
            )}
            <p className="text-gray-400 text-xs mt-2">
              <i className="fas fa-shield-alt mr-1"></i>
              We only store the last 4 digits of your SSN.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-phone text-[#0078AE] mr-2"></i>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={onChange}
              onBlur={() => onBlur("phone")}
              className={inputClass("phone")}
              placeholder="(555) 555-5555"
            />
            {errors.phone && touched.phone && (
              <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <i className="fas fa-envelope text-[#0078AE] mr-2"></i>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            readOnly
            className={readOnlyClass}
          />
          <p className="text-xs text-gray-400 mt-1">From your account</p>
        </div>
      </div>

      {/* Missouri Residency â€” Address */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          <i className="fas fa-map-marker-alt text-[#0078AE]"></i>
          Missouri Residency
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          This program is only available to Missouri residents.
          Your state must be <span className="font-semibold">MO</span>.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress || ""}
              onChange={onChange}
              onBlur={() => onBlur("streetAddress")}
              className={inputClass("streetAddress")}
              placeholder="123 Main St"
            />
            {errors.streetAddress && touched.streetAddress && (
              <p className="text-red-500 text-sm mt-2">{errors.streetAddress}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={onChange}
                onBlur={() => onBlur("city")}
                className={inputClass("city")}
                placeholder="Kansas City"
              />
              {errors.city && touched.city && (
                <p className="text-red-500 text-sm mt-2">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state || ""}
                onChange={onChange}
                onBlur={() => onBlur("state")}
                className={inputClass("state")}
                placeholder="MO"
                maxLength="2"
              />
              {errors.state && touched.state && (
                <p className="text-red-500 text-sm mt-2">{errors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode || ""}
                onChange={onChange}
                onBlur={() => onBlur("zipCode")}
                className={inputClass("zipCode")}
                placeholder="64101"
                maxLength="5"
                pattern="\d*"
              />
              {errors.zipCode && touched.zipCode && (
                <p className="text-red-500 text-sm mt-2">{errors.zipCode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Acknowledgement checkbox */}
        <div
          className={`mt-5 rounded-2xl p-5 transition-all duration-300 ${
            errors.isMissouriResident && touched.isMissouriResident
              ? "bg-red-50 border-2 border-red-300"
              : formData.isMissouriResident
                ? "bg-green-50 border-2 border-green-300"
                : "bg-[#0078AE]/5 border-2 border-[#0078AE]/30"
          }`}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isMissouriResident"
              checked={formData.isMissouriResident || false}
              onChange={onChange}
              onBlur={() => onBlur("isMissouriResident")}
              className="mt-1 w-5 h-5 text-[#0078AE] rounded focus:ring-[#0078AE]"
            />
            <div className="flex-1">
              <span className="font-semibold text-gray-800">
                I confirm the above address is my primary Missouri residence
                <span className="text-red-500 ml-1">*</span>
              </span>
              <p className="text-sm text-gray-600 mt-1">
                By checking this box, I certify that the address provided is
                accurate and that I am a current resident of Missouri.
              </p>
              {errors.isMissouriResident && touched.isMissouriResident && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <i className="fas fa-times-circle"></i>
                  {errors.isMissouriResident}
                </p>
              )}
              {formData.isMissouriResident && (
                <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                  <i className="fas fa-check-circle"></i>
                  Address confirmed &mdash; you are eligible to apply
                </p>
              )}
            </div>
          </label>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#0078AE]/5 to-[#0078AE]/10 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-lock text-[#0078AE] mt-0.5"></i>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Secure & Encrypted
            </p>
            <p className="text-xs text-gray-600">
              Your identity information is protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;

