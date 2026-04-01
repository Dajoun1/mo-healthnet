const ProgressBar = ({ currentStep, totalSteps, onHomeClick }) => {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8 relative">
      {/* Home button - top left */}
      <button
        onClick={onHomeClick}
        className="absolute top-0 left-0  text-gray-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
        aria-label="Go to home"
      >
        <i className="fas fa-home text-xl"></i>
      </button>

      <div className="flex justify-between mb-3">
        {[...Array(totalSteps)].map((_, idx) => {
          const stepNum = idx + 1
          const isActive = stepNum === currentStep
          const isCompleted = stepNum < currentStep
          
          const stepLabels = {
            1: "Personal Info",
            2: "Activity",
            3: "Document",
            4: "Review",
          }
          return (
            <div key={idx} className="flex flex-col items-center flex-1">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110' : 
                  isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                {isCompleted ? <i className="fas fa-check text-sm"></i> : stepNum}
              </div>
              <div className="text-xs mt-2 text-gray-500 hidden md:block">
                {stepLabels[stepNum]}
              </div>
            </div>
          )
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
