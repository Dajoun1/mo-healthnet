const emptyActivity = () => ({ activityType: '', organizationName: '', hoursPerMonth: '' });

const ACTIVITY_TYPES = [
  { value: 'Employment', icon: 'fa-briefcase', label: 'Employer Name', iconClass: 'text-blue-500' },
  { value: 'Education', icon: 'fa-graduation-cap', label: 'School Name', iconClass: 'text-green-500' },
  { value: 'Community Service', icon: 'fa-hand-holding-heart', label: 'Organization Name', iconClass: 'text-purple-500' },
];

const ActivityInfo = ({ activities, onActivitiesChange, errors, touched, onBlur }) => {

  const updateActivity = (index, field, value) => {
    // Functional update to always work off the latest state
    onActivitiesChange(prev =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  };

  const addActivity = () => {
    onActivitiesChange(prev => [...prev, emptyActivity()]);
  };

  const removeActivity = (index) => {
    onActivitiesChange(prev => prev.filter((_, i) => i !== index));
  };

  const inputClass = (index, field) => `
    w-full px-5 py-3.5 rounded-2xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200
    ${errors[`activities.${index}.${field}`] && touched[`activities.${index}.${field}`]
      ? 'border-red-400 focus:border-red-500 ring-4 ring-red-500/20'
      : 'border-gray-200 focus:border-[#0078AE] focus:ring-4 focus:ring-[#0078AE]/20'}
    focus:outline-none
  `;

  return (
    <div className="space-y-6">
      {activities.map((activity, index) => {
        const orgLabel = ACTIVITY_TYPES.find(t => t.value === activity.activityType)?.label || 'Organization Name';

        return (
          <div key={index} className="border-2 border-gray-200 rounded-2xl p-5 space-y-4 bg-white/30">
            {/* Card header */}
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-700">Activity #{index + 1}</h4>
              {activities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeActivity(index)}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                >
                  <i className="fas fa-trash-alt"></i> Remove
                </button>
              )}
            </div>

            {/* Activity type selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Activity Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {ACTIVITY_TYPES.map((type) => {
                  const isSelected = activity.activityType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        updateActivity(index, 'activityType', type.value);
                        updateActivity(index, 'organizationName', '');
                        onBlur(`activities.${index}.activityType`);
                      }}
                      style={isSelected
                        ? { borderColor: '#0078AE', backgroundColor: 'rgba(0,120,174,0.08)', boxShadow: '0 0 0 3px rgba(0,120,174,0.25)' }
                        : {}}
                      className="relative p-4 rounded-2xl border-2 border-gray-200 bg-white transition-all duration-150 hover:border-gray-300 hover:bg-gray-50"
                    >
                      {isSelected && (
                        <span
                          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#0078AE' }}
                        >
                          <i className="fas fa-check text-white" style={{ fontSize: '9px' }}></i>
                        </span>
                      )}
                      <i className={`fas ${type.icon} text-2xl ${type.iconClass} mb-2 block`}></i>
                      <span className={`text-sm ${isSelected ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                        {type.value}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors[`activities.${index}.activityType`] && touched[`activities.${index}.activityType`] && (
                <p className="text-red-500 text-sm mt-2">{errors[`activities.${index}.activityType`]}</p>
              )}
            </div>

            {/* Organization name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-building text-[#0078AE] mr-2"></i>
                {orgLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={activity.organizationName}
                onChange={(e) => updateActivity(index, 'organizationName', e.target.value)}
                onBlur={() => onBlur(`activities.${index}.organizationName`)}
                className={inputClass(index, 'organizationName')}
                placeholder={`Enter ${orgLabel.toLowerCase()}`}
              />
              {errors[`activities.${index}.organizationName`] && touched[`activities.${index}.organizationName`] && (
                <p className="text-red-500 text-sm mt-2">{errors[`activities.${index}.organizationName`]}</p>
              )}
            </div>

            {/* Hours per month */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-clock text-[#0078AE] mr-2"></i>
                Hours Per Month <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={activity.hoursPerMonth}
                onChange={(e) => updateActivity(index, 'hoursPerMonth', e.target.value)}
                onBlur={() => onBlur(`activities.${index}.hoursPerMonth`)}
                min="1"
                className={inputClass(index, 'hoursPerMonth')}
                placeholder="Average monthly commitment"
              />
              {errors[`activities.${index}.hoursPerMonth`] && touched[`activities.${index}.hoursPerMonth`] && (
                <p className="text-red-500 text-sm mt-2">{errors[`activities.${index}.hoursPerMonth`]}</p>
              )}
              <div className="mt-2 p-3 bg-yellow-50 rounded-xl border border-yellow-200 flex items-start gap-2">
                <i className="fas fa-info-circle text-yellow-600 mt-0.5"></i>
                <p className="text-sm text-yellow-700">
                  At least <strong>80 combined hours/month</strong> across all activities required for eligibility.
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addActivity}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-[#0078AE]/50 text-[#0078AE] font-semibold hover:border-[#0078AE] hover:bg-[#0078AE]/5 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <i className="fas fa-plus-circle"></i>
        Add Another Activity
      </button>
    </div>
  );
};

export default ActivityInfo;
