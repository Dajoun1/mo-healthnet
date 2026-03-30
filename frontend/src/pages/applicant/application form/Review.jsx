const Review = ({
  formData,
  file,
  onSubmit,
  onBack,
  submitLoading,
  getOrganizationLabel,
}) => {
  const renderReviewSection = (title, icon, items) => (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <i className={`fas ${icon} text-blue-500`}></i>
        {title}
      </h3>
      <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
          >
            <span className="text-gray-600 text-sm">{item.label}</span>
            <span className="font-medium text-gray-800 text-sm">
              {item.value || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const personalItems = [
    {
      label: "Full Name",
      value: `${formData.firstName || ""} ${formData.lastName || ""}`.trim(),
    },
    { label: "Date of Birth", value: formData.dob || "—" },
    { label: "Household Size", value: formData.householdSize || "—" },
    {
      label: "Missouri Resident",
      value: formData.isMissouriResident ? "Yes ✓" : "No ✗",
    },
    {
      label: "SSN (Last 4)",
      value: formData.ssnLast4 ? `***-**-${formData.ssnLast4}` : "—",
    },
    { label: "Email", value: formData.email || "—" },
  ];



  const activityItems = [
    { label: "Activity Type", value: formData.activityType || "—" },
    { label: getOrganizationLabel(), value: formData.organizationName || "—" },
    { label: "Hours / Month", value: formData.hoursPerMonth || "—" },
    {
      label: "Eligibility Status",
      value:
        formData.hoursPerMonth >= 80
          ? "✓ Eligible (80+ hours)"
          : "✗ Below requirement",
    },
  ];

  const isEligible =
    formData.isMissouriResident && formData.hoursPerMonth >= 80;

  return (
    <div className="space-y-6">
      {!isEligible && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            <div>
              <h4 className="font-bold text-red-800">Eligibility Alert</h4>
              <p className="text-red-700 text-sm">
                {!formData.isMissouriResident &&
                  "You must be a Missouri resident to apply. "}
                {formData.hoursPerMonth < 80 &&
                  "You need at least 80 hours per month to be eligible. "}
                Please review your application before submitting.
              </p>
            </div>
          </div>
        </div>
      )}

      {renderReviewSection("Personal Information", "fa-user", personalItems)}
      {renderReviewSection("Activity Details", "fa-chart-line", activityItems)}

      <div className="bg-gray-50 rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Proof Document</span>
          <span className="font-medium text-gray-800">
            {file ? file.name : "Not uploaded"}
          </span>
        </div>
      </div>

      <div
        className={`rounded-2xl p-4 ${isEligible ? "bg-green-50 border border-green-300" : "bg-yellow-50 border border-yellow-300"}`}
      >
        <div className="flex items-start gap-3">
          <i
            className={`fas ${isEligible ? "fa-check-circle text-green-600" : "fa-info-circle text-yellow-600"} mt-0.5`}
          ></i>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {isEligible ? "You appear to be eligible!" : "Review Required"}
            </p>
            <p className="text-sm text-gray-700">
              {isEligible
                ? "Based on the information provided, you meet the basic eligibility requirements."
                : "Please ensure you meet all requirements before submitting your application."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
          <p className="text-sm text-yellow-800">
            By submitting this application, you confirm that all information
            provided is accurate and complete. False statements may result in
            denial of coverage or legal action.
          </p>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={onBack}
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <i className="fas fa-arrow-left"></i>
          Back to Edit
        </button>
        <button
          onClick={onSubmit}
          disabled={submitLoading}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {submitLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Submitting...
            </>
          ) : (
            <>
              <i className="fas fa-check-circle"></i>
              Submit Application
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Review;
