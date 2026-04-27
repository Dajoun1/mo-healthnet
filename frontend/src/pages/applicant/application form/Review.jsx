const Review = ({
  formData,
  files,
  onSubmit,
  onBack,
  submitLoading,
  getOrganizationLabel,
  totalHours,
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split("-");
    return `${month}-${day}-${year}`;
  };

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
    { label: "Date of Birth", value: formatDate(formData.dob) },
    { label: "Household Size", value: formData.householdSize || "-" },
    {
      label: "SSN (Last 4)",
      value: formData.ssnLast4 ? `***-**-${formData.ssnLast4}` : "-",
    },
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

  const isEligible = formData.isMissouriResident && totalHours >= 80;

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
                  `Total hours: ${totalHours}/80 - Need at least 80 hours per month. `}
                Please review your application before submitting.
              </p>
            </div>
          </div>
        </div>
      )}

      {renderReviewSection("Personal Information", "fa-user", personalItems)}

      {/* Activities Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <i className="fas fa-chart-line text-[#0078AE]"></i>
          Activities ({formData.activities?.length || 0})
        </h3>
        <div className="space-y-3">
          {formData.activities?.map((activity, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-800">
                  {activity.activityType}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {getOrganizationLabel(activity.activityType)}:
                  </span>
                  <span className="font-medium text-gray-800">
                    {activity.organizationName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hours/Month:</span>
                  <span className="font-medium text-gray-800">
                    {activity.hoursPerMonth} hrs
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">
                Total Monthly Hours:
              </span>
              <span
                className={`font-bold text-lg ${totalHours >= 80 ? "text-green-600" : "text-orange-600"}`}
              >
                {totalHours} hours
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <i className="fas fa-paperclip text-[#0078AE]"></i>
          Supporting Documents ({files?.length || 0})
        </h3>
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
          {files && files.length > 0 ? (
            files.map((file, index) => (
              <div
                key={index}
                className="py-2 border-b border-gray-200 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded{" "}
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </p>
                    {file.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {file.description}
                      </p>
                    )}
                  </div>
                  <i className="fas fa-check-circle text-green-500"></i>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No documents uploaded
            </p>
          )}
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
