const Review = ({ formData, activities, onSubmit, onBack, submitLoading }) => {
  const totalHours = activities.reduce(
    (sum, a) => sum + (Number(a.hoursPerMonth) || 0),
    0
  );
  const isEligible = formData.isMissouriResident && totalHours >= 80;

  const renderReviewSection = (title, icon, items) => (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <i className={`fas ${icon} text-[#0078AE]`}></i>
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
              {item.value || "-"}
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
    { label: "Household Size", value: formData.householdSize || "-" },
    { label: "Email", value: formData.email || "-" },
    { label: "Phone", value: formData.phone || "-" },
    { label: "Street Address", value: formData.streetAddress || "-" },
    {
      label: "City, State ZIP",
      value:
        formData.city && formData.state
          ? `${formData.city}, ${formData.state.toUpperCase()} ${formData.zipCode || ""}`.trim()
          : "-",
    },
    {
      label: "Missouri Resident",
      value: formData.isMissouriResident ? "Confirmed" : "Not confirmed",
    },
  ];

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
                {totalHours < 80 &&
                  `You need at least 80 combined hours per month (currently ${totalHours}). `}
                Please review your application before submitting.
              </p>
            </div>
          </div>
        </div>
      )}

      {renderReviewSection("Personal Information", "fa-user", personalItems)}

      {/* Activities */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <i className="fas fa-chart-line text-[#0078AE]"></i>
          Activity Details
        </h3>
        {activities.map((act, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded-2xl p-4 space-y-2 mb-3"
          >
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Activity #{idx + 1}
            </p>
            {[
              { label: "Activity Type", value: act.activityType },
              { label: "Organization / Employer", value: act.organizationName },
              { label: "Hours / Month", value: act.hoursPerMonth },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
              >
                <span className="text-gray-600 text-sm">{item.label}</span>
                <span className="font-medium text-gray-800 text-sm">
                  {item.value || "-"}
                </span>
              </div>
            ))}
          </div>
        ))}
        <div className="flex justify-between items-center px-4 py-3 bg-blue-50 rounded-2xl border border-blue-200">
          <span className="text-blue-700 font-semibold text-sm">
            Total Hours / Month
          </span>
          <span
            className={`font-bold text-sm ${
              totalHours >= 80 ? "text-green-600" : "text-red-600"
            }`}
          >
            {totalHours} hrs{" "}
            {totalHours >= 80 ? "✓ Eligible" : "✗ Below 80"}
          </span>
        </div>
      </div>

      <div
        className={`rounded-2xl p-4 ${
          isEligible
            ? "bg-green-50 border border-green-300"
            : "bg-yellow-50 border border-yellow-300"
        }`}
      >
        <div className="flex items-start gap-3">
          <i
            className={`fas ${
              isEligible
                ? "fa-check-circle text-green-600"
                : "fa-info-circle text-yellow-600"
            } mt-0.5`}
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
