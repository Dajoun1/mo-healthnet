import { useState } from "react";
import ProgressBar from "./ProgressBar";
import PersonalInfo from "./PersonalInfo";
import ActivityInfo from "./ActivityInfo";
import Documentation from "./Documentation";
import Review from "./Review";
import { applicationApi } from "../../../services/applicationApi";
import { useAuth } from "../../../context/AuthContext";

const TOTAL_STEPS = 4;

function ApplicationForm() {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dob: "",
    householdSize: "",
    isMissouriResident: false,
    ssnLast4: "",
    email: user?.username || user?.email || "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    activities: [], // Changed from single activity to array
  });
  const [proofFiles, setProofFiles] = useState([]); // Changed from single file to array
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const resetForm = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dob: "",
      householdSize: "",
      isMissouriResident: false,
      ssnLast4: "",
      email: user?.username || user?.email || "",
      activityType: "",
      organizationName: "",
      hoursPerMonth: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      activities: [],
    });
    setProofFiles([]);
    setErrors({});
    setTouched({});
    setStep(1);
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.firstName?.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName?.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.dob) newErrors.dob = "Date of birth is required";
      if (!formData.householdSize || formData.householdSize < 1)
        newErrors.householdSize = "Valid household size (1 or more) required";
      if (!/^\d{4}$/.test(formData.ssnLast4))
        newErrors.ssnLast4 = "Exactly 4 digits required";
      if (!/^\S+@\S+\.\S+$/.test(formData.email))
        newErrors.email = "Valid email address required";
      if (!formData.streetAddress?.trim())
        newErrors.streetAddress = "Street address is required";
      if (!formData.city?.trim())
        newErrors.city = "City is required";
      if (!formData.state?.trim())
        newErrors.state = "State is required";
      else if (formData.state.trim().toUpperCase() !== "MO")
        newErrors.state = "You must be a Missouri resident to apply";
      if (!/^\d{5}$/.test(formData.zipCode))
        newErrors.zipCode = "Valid 5-digit ZIP code required";
      if (!formData.isMissouriResident)
        newErrors.isMissouriResident =
          "You must confirm your Missouri residency to continue";
    } else if (stepNumber === 2) {
      if (!formData.activities || formData.activities.length === 0) {
        newErrors.activities = "Please add at least one activity";
      } else {
        const totalHours = formData.activities.reduce((sum, activity) => 
          sum + (parseInt(activity.hoursPerMonth) || 0), 0
        );
        if (totalHours < 80) {
          newErrors.totalHours = "Total hours across all activities must be at least 80 hours per month";
        }
      }
    } else if (stepNumber === 3) {
      if (!proofFiles || proofFiles.length === 0) {
        newErrors.file = "Please upload at least one proof document";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getOrganizationLabel = (activityType = null) => {
    const type = activityType || (formData.activities[formData.activities.length - 1]?.activityType);
    switch (type) {
      case "Employment":
        return "Employer Name";
      case "Education":
        return "School Name";
      case "Community Service":
        return "Organization Name";
      default:
        return "Organization Name";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleFilesChange = (files) => {
    setProofFiles(files);
    if (errors.file) setErrors((prev) => ({ ...prev, file: undefined }));
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      setErrors({});
    } else {
      const step1Fields = [
        "firstName", "lastName", "dob", "householdSize", "ssnLast4",
        "email", "streetAddress", "city", "state", "zipCode", "isMissouriResident",
      ];
      const step2Fields = ["activities", "totalHours"];
      const step3Fields = ["file"];
      const fieldsToTouch =
        step === 1 ? step1Fields : step === 2 ? step2Fields : step3Fields;
      const newTouched = {};
      fieldsToTouch.forEach((f) => (newTouched[f] = true));
      setTouched((prev) => ({ ...prev, ...newTouched }));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setSubmitLoading(true);

    const payload = new FormData();

    // Add form data
    Object.keys(formData).forEach((key) => {
      if (key === 'activities') {
        payload.append(key, JSON.stringify(formData[key]));
      } else if (formData[key] !== undefined && formData[key] !== "") {
        payload.append(key, formData[key]);
      }
    });

    // Add multiple files
    if (proofFiles && proofFiles.length > 0) {
      proofFiles.forEach((fileItem, index) => {
        payload.append(`proofDocuments`, fileItem.file);
        payload.append(`proofDocument_${index}_name`, fileItem.name);
        if (fileItem.description) {
          payload.append(`proofDocument_${index}_description`, fileItem.description);
        }
      });
    }

    // Add user ID from auth context
    if (user?.id) {
      payload.append("userId", user.id);
    }

    // Add timestamp
    payload.append("submittedAt", new Date().toISOString());

    try {
      const result = await applicationApi.submitApplication(payload);

      if (result.success) {
        const applicationId = result.data.applicationId;
        localStorage.setItem("lastApplicationId", applicationId);

        alert(
          `🎉 Application submitted successfully!\n\nApplication ID: ${applicationId}\nDocuments uploaded: ${proofFiles.length}\nActivities: ${formData.activities.length}\n\nWe'll review your application and contact you within 48 hours.`,
        );
        resetForm();
      } else {
        alert(`Submission failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please try again or contact support.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const stepInfo = {
    1: { title: "Personal Details", subtitle: "", icon: "fa-user-circle" },
    2: { title: "Activity Information", subtitle: "Add one or more activities", icon: "fa-chart-line" },
    3: { title: "Documentation", subtitle: "Upload supporting documents", icon: "fa-file-alt" },
    4: { title: "Review & Submit", subtitle: "", icon: "fa-regular fa-calendar-check" },
  };

  // Calculate total hours for display
  const totalHours = formData.activities?.reduce((sum, activity) => 
    sum + (parseInt(activity.hoursPerMonth) || 0), 0
  ) || 0;

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center relative my-10">
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#0078AE]/50/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-10">
          <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-md text-[#0078AE] text-6xl mb-4">
              <i className={`fas ${stepInfo[step].icon}`}></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {stepInfo[step].title}
            </h2>
            <p className="text-gray-500">{stepInfo[step].subtitle}</p>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-2xl flex items-start gap-3">
              <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Please fix the following before continuing:
                </p>
                <ul className="mt-1 list-disc list-inside text-sm text-red-600 space-y-0.5">
                  {Object.entries(errors).map(([key, msg]) => (
                    <li key={key}>{msg}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mb-10">
            {step === 1 && (
              <PersonalInfo
                formData={formData}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
            )}
            {step === 2 && (
              <ActivityInfo
                formData={formData}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                getOrganizationLabel={getOrganizationLabel}
              />
            )}
            {step === 3 && (
              <Documentation
                files={proofFiles}
                onFilesChange={handleFilesChange}
                errors={errors}
              />
            )}
            {step === 4 && (
              <Review
                formData={formData}
                files={proofFiles}
                onSubmit={handleSubmit}
                onBack={prevStep}
                submitLoading={submitLoading}
                getOrganizationLabel={getOrganizationLabel}
                totalHours={totalHours}
              />
            )}
          </div>

          {step !== 4 && (
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-arrow-left"></i>
                  Back
                </button>
              ) : (
                <div className="flex-1"></div>
              )}
              <button
                onClick={nextStep}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                Continue
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-white/60 text-sm">
          <i className="fas fa-lock mr-2"></i>
          Your information is encrypted and secure
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;