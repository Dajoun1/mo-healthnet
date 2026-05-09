﻿import { Link } from "react-router-dom";

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Back to dashboard */}
      <Link
        to="/applicant/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[#0078AE] hover:underline mb-4"
      >
        <i className="fas fa-arrow-left text-xs"></i>
        Back to Dashboard
      </Link>

      <div className="flex justify-between mb-3">
        {[...Array(totalSteps)].map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          const stepLabels = {
            1: "Personal Info",
            2: "Activity",
            3: "Documents",
            4: "Review",
          };

          return (
            <div key={idx} className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                  ${!isActive && !isCompleted ? "bg-gray-200 text-gray-500" : ""}
                  ${isActive ? "text-white shadow-lg scale-110" : ""}
                `}
                style={isActive ? { backgroundColor: "#0078AE" } : isCompleted ? { backgroundColor: "#0078AE" } : {}}
              >
                {isCompleted ? <i className="fas fa-check text-sm text-white"></i> : stepNum}
              </div>
              <div className="text-xs mt-2 text-gray-500 hidden md:block">
                {stepLabels[stepNum]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%`, backgroundColor: "#0078AE" }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
