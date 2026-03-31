const PersonalInfo = ({ formData, onChange, onBlur, errors, touched }) => {
  const inputClass = (fieldName) => `
    w-full px-5 py-3.5 rounded-2xl border-2 bg-white/50 backdrop-blur-sm
    transition-all duration-200
    ${
      errors[fieldName] && touched[fieldName]
        ? "border-red-400 focus:border-red-500 ring-4 ring-red-500/20"
        : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
    }
    focus:outline-none
  `;

  return (
    <div className="space-y-6">
      {/* Missouri Residency Check - Critical Validation */}
      <div
        className={`
        rounded-2xl p-5 transition-all duration-300
        ${
          !formData.isMissouriResident &&
          touched.isMissouriResident &&
          errors.isMissouriResident
            ? "bg-red-50 border-2 border-red-300"
            : formData.isMissouriResident
              ? "bg-green-50 border-2 border-green-300"
              : "bg-blue-50 border-2 border-blue-200"
        }
      `}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isMissouriResident"
            checked={formData.isMissouriResident || false}
            onChange={onChange}
            onBlur={() => onBlur("isMissouriResident")}
            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div className="flex-1">
            <span className="font-semibold text-gray-800">
              I am a resident of Missouri
              <span className="text-red-500 ml-1">*</span>
            </span>
            <p className="text-sm text-gray-600 mt-1">
              This program is only available to Missouri residents.
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
                You are eligible to apply
              </p>
            )}
          </div>
        </label>
      </div>

      {/* Personal Information Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-user text-blue-500"></i>
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
              onChange={onChange}
              onBlur={() => onBlur("firstName")}
              className={inputClass("firstName")}
              placeholder="first name"
            />
            {errors.firstName && touched.firstName && (
              <p className="text-red-500 text-sm mt-2">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={onChange}
              onBlur={() => onBlur("lastName")}
              className={inputClass("lastName")}
              placeholder="last name"
            />
            {errors.lastName && touched.lastName && (
              <p className="text-red-500 text-sm mt-2">{errors.lastName}</p>
            )}
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
              placeholder="family members"
            />
            {errors.householdSize && touched.householdSize && (
              <p className="text-red-500 text-sm mt-2">
                {errors.householdSize}
              </p>
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
              placeholder="••••"
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
              <i className="fas fa-phone text-blue-500 mr-2"></i>
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
            <i className="fas fa-envelope text-blue-500 mr-2"></i>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={onChange}
            onBlur={() => onBlur("email")}
            className={inputClass("email")}
            placeholder="you@example.com"
          />
          {errors.email && touched.email && (
            <p className="text-red-500 text-sm mt-2">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-lock text-indigo-500 mt-0.5"></i>
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
