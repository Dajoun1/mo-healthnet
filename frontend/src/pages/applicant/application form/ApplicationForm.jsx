import { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import PersonalInfo from "./PersonalInfo";
import ActivityInfo from "./ActivityInfo";
import Documentation from "./Documentation";
import Review from "./Review";
import { applicationApi } from "../../../services/applicationApi";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api";

const TOTAL_STEPS = 4;

function ApplicationForm() {
  const [step, setStep] = useState(1);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.username || user?.email || "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "MO",
    zipCode: "",
    birthDate: "",
    isMissouriResident: true,
    householdSize: "",
  });

  const [activities, setActivities] = useState([
    { activityType: "", organizationName: "", hoursPerMonth: "" },
  ]);

  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch fresh profile from DB on mount — bypasses stale localStorage
  useEffect(() => {
    const email = user?.username || user?.email;
    if (!email) { setProfileLoading(false); return; }

    api.get(`/auth/profile?email=${encodeURIComponent(email)}`)
      .then((res) => {
        const p = res.data;
        setFormData((prev) => ({
          ...prev,
          firstName: p.firstName || prev.firstName,
          lastName: p.lastName || prev.lastName,
          email: p.email || prev.email,
          phone: p.phone || "",
          streetAddress: p.streetAddress || "",
          city: p.city || "",
          state: p.state || "MO",
          zipCode: p.zipCode || "",
          birthDate: p.birthDate || "",
        }));
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.username || user?.email || "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "MO",
      zipCode: "",
      birthDate: "",
      isMissouriResident: true,
      householdSize: "",
    });
    setActivities([{ activityType: "", organizationName: "", hoursPerMonth: "" }]);
    setErrors({});
    setTouched({});
    setStep(1);
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    if (stepNumber === 1) {
      if (!formData.householdSize || formData.householdSize < 1)
        newErrors.householdSize = "Valid household size (1 or more) required";
      // Only validate these if they were missing from DB (editable fields)
      if (!formData.birthDate)
        newErrors.birthDate = "Date of birth is required";
      if (!formData.streetAddress?.trim())
        newErrors.streetAddress = "Street address is required";
      if (!formData.city?.trim())
        newErrors.city = "City is required";
      if (!formData.state?.trim() || formData.state.trim().toUpperCase() !== "MO")
        newErrors.state = "Must be a Missouri address (MO)";
      if (!/^\d{5}$/.test(formData.zipCode))
        newErrors.zipCode = "Valid 5-digit ZIP required";
    } else if (stepNumber === 2) {
      activities.forEach((act, i) => {
        if (!act.activityType)
          newErrors[`activities.${i}.activityType`] = "Please select activity type";
        if (!act.organizationName?.trim())
          newErrors[`activities.${i}.organizationName`] = "Organization name is required";
        if (!act.hoursPerMonth || act.hoursPerMonth < 1)
          newErrors[`activities.${i}.hoursPerMonth`] = "Hours per month must be at least 1";
      });
      const totalHours = activities.reduce((sum, a) => sum + (Number(a.hoursPerMonth) || 0), 0);
      if (totalHours < 80)
        newErrors.hoursPerMonthWarning = `Total hours: ${totalHours}/month. At least 80 required for eligibility.`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).filter((k) => k !== "hoursPerMonthWarning").length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      setErrors({});
    } else {
      if (step === 1) setTouched((prev) => ({
        ...prev, householdSize: true, birthDate: true,
        streetAddress: true, city: true, state: true, zipCode: true,
      }));
      if (step === 2) {
        const newTouched = {};
        activities.forEach((_, i) => {
          newTouched[`activities.${i}.activityType`] = true;
          newTouched[`activities.${i}.organizationName`] = true;
          newTouched[`activities.${i}.hoursPerMonth`] = true;
        });
        setTouched((prev) => ({ ...prev, ...newTouched }));
      }
    }
  };

  const prevStep = () => { setStep((prev) => Math.max(prev - 1, 1)); setErrors({}); };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    const payload = {
      userId: user?.id || user?.userId || null,
      userEmail: user?.username || user?.email || null,
      householdSize: formData.householdSize,
      phone: formData.phone || null,
      streetAddress: formData.streetAddress,
      city: formData.city,
      state: formData.state?.toUpperCase() || "MO",
      zipCode: formData.zipCode,
      isMissouriResident: true,
      activities: activities.map((a) => ({
        activityType: a.activityType,
        organizationName: a.organizationName,
        hoursPerMonth: Number(a.hoursPerMonth),
      })),
    };
    try {
      const result = await applicationApi.submitApplication(payload);
      if (result.success) {
        localStorage.setItem("lastApplicationId", result.data.applicationId);
        alert(`🎉 Application submitted!\n\nApplication ID: ${result.data.applicationId}\nWe'll review and contact you within 48 hours.`);
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
    2: { title: "Activity Information", subtitle: "", icon: "fa-chart-line" },
    3: { title: "Documentation", subtitle: "", icon: "fa-file-alt" },
    4: { title: "Review & Submit", subtitle: "", icon: "fa-calendar-check" },
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
        {profileLoading ? (
          <div className="glass-card rounded-3xl p-16 flex flex-col items-center gap-4">
            <i className="fas fa-spinner fa-spin text-4xl text-[#0078AE]"></i>
            <p className="text-gray-500 font-medium">Loading your profile...</p>
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-8 md:p-10">
            <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-md text-[#0078AE] text-6xl mb-4">
                <i className={`fas ${stepInfo[step].icon}`}></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{stepInfo[step].title}</h2>
              <p className="text-gray-500">{stepInfo[step].subtitle}</p>
            </div>

            {Object.keys(errors).filter((k) => k !== "hoursPerMonthWarning").length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-2xl flex items-start gap-3">
                <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                <div>
                  <p className="text-sm font-semibold text-red-700">Please fix the following before continuing:</p>
                  <ul className="mt-1 list-disc list-inside text-sm text-red-600 space-y-0.5">
                    {Object.entries(errors)
                      .filter(([key]) => key !== "hoursPerMonthWarning")
                      .map(([, msg]) => <li key={msg}>{msg}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {errors.hoursPerMonthWarning && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-2xl flex items-start gap-3">
                <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
                <p className="text-sm text-yellow-800">{errors.hoursPerMonthWarning}</p>
              </div>
            )}

            <div className="mb-10">
              {step === 1 && (
                <PersonalInfo formData={formData} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
              )}
              {step === 2 && (
                <ActivityInfo activities={activities} onActivitiesChange={setActivities} errors={errors} touched={touched} onBlur={handleBlur} />
              )}
              {step === 3 && <Documentation />}
              {step === 4 && (
                <Review formData={formData} activities={activities} onSubmit={handleSubmit} onBack={prevStep} submitLoading={submitLoading} />
              )}
            </div>

            {step !== 4 && (
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                {step > 1 ? (
                  <button onClick={prevStep} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                    <i className="fas fa-arrow-left"></i> Back
                  </button>
                ) : (
                  <div className="flex-1"></div>
                )}
                <button onClick={nextStep} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  Continue <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-6 text-white/60 text-sm">
          <i className="fas fa-lock mr-2"></i>
          Your information is encrypted and secure
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;