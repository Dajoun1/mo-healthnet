const ActivityInfo = ({ formData, onChange, onBlur, errors, touched, getOrganizationLabel }) => {
  const inputClass = (fieldName) => `
    w-full px-5 py-3.5 rounded-2xl border-2 bg-white/50 backdrop-blur-sm
    transition-all duration-200
    ${errors[fieldName] && touched[fieldName] 
      ? 'border-red-400 focus:border-red-500 ring-4 ring-red-500/20' 
      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'}
    focus:outline-none
  `
  
  const activityTypes = [
    { value: 'Employment', icon: 'fa-briefcase', color: 'blue', label: 'Employer Name' },
    { value: 'Education', icon: 'fa-graduation-cap', color: 'green', label: 'School Name' },
    { value: 'Community Service', icon: 'fa-hand-holding-heart', color: 'purple', label: 'Organization Name' }
  ]
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <i className="fas fa-tasks text-blue-500 mr-2"></i>
          Activity Type
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activityTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => {
                const e = { target: { name: 'activityType', value: type.value } }
                onChange(e)
                // Reset organization name when activity type changes
                const resetOrg = { target: { name: 'organizationName', value: '' } }
                onChange(resetOrg)
                onBlur('activityType')
              }}
              className={`
                p-4 rounded-2xl border-2 transition-all duration-200
                ${formData.activityType === type.value 
                  ? `border-${type.color}-500 bg-${type.color}-50 shadow-md` 
                  : 'border-gray-200 bg-white/50 hover:border-gray-300'}
              `}
            >
              <i className={`fas ${type.icon} text-2xl text-${type.color}-500 mb-2 block`}></i>
              <span className="font-medium text-gray-700">{type.value}</span>
            </button>
          ))}
        </div>
        {errors.activityType && touched.activityType && (
          <p className="text-red-500 text-sm mt-2">{errors.activityType}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <i className="fas fa-building text-blue-500 mr-2"></i>
          {getOrganizationLabel()}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          name="organizationName"
          value={formData.organizationName || ''}
          onChange={onChange}
          onBlur={() => onBlur('organizationName')}
          className={inputClass('organizationName')}
          placeholder={`Enter ${getOrganizationLabel().toLowerCase()}`}
        />
        {errors.organizationName && touched.organizationName && (
          <p className="text-red-500 text-sm mt-2">{errors.organizationName}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <i className="fas fa-clock text-blue-500 mr-2"></i>
          Hours Per Month
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="number"
          name="hoursPerMonth"
          value={formData.hoursPerMonth || ''}
          onChange={onChange}
          onBlur={() => onBlur('hoursPerMonth')}
          min="1"
          className={inputClass('hoursPerMonth')}
          placeholder="Average monthly commitment"
        />
        
        {/* Hours Reminder */}
        <div className="mt-2 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="flex items-start gap-2">
            <i className="fas fa-info-circle text-yellow-600 mt-0.5"></i>
            <div>
              <p className="text-sm font-semibold text-yellow-800">Eligibility Requirement</p>
              <p className="text-sm text-yellow-700">
                You need at least <span className="font-bold">80 hours per month</span> to be eligible for Missouri Medicaid Program.
              </p>
              {formData.hoursPerMonth && formData.hoursPerMonth < 80 && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <i className="fas fa-exclamation-triangle"></i>
                  Current: {formData.hoursPerMonth} hours/month - Below the 80-hour requirement
                </p>
              )}
              {formData.hoursPerMonth && formData.hoursPerMonth >= 80 && (
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <i className="fas fa-check-circle"></i>
                  You meet the 80+ hours/month requirement
                </p>
              )}
            </div>
          </div>
        </div>
        
        {errors.hoursPerMonth && touched.hoursPerMonth && (
          <p className="text-red-500 text-sm mt-2">{errors.hoursPerMonth}</p>
        )}
      </div>
    </div>
  )
}

export default ActivityInfo