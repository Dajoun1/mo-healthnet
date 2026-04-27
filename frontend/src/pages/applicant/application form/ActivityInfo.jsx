﻿import { useState } from 'react';

const ActivityInfo = ({ formData, onChange, errors, touched, getOrganizationLabel }) => {
  const [activities, setActivities] = useState(formData.activities || []);
  const [currentActivity, setCurrentActivity] = useState({
    activityType: '',
    organizationName: '',
    hoursPerMonth: ''
  });
  const [editIndex, setEditIndex] = useState(null);

  const inputClass = (fieldName, index = null) => `
    w-full px-5 py-3.5 rounded-2xl border-2 bg-white/50 backdrop-blur-sm
    transition-all duration-200
    ${errors[fieldName] && touched[fieldName] && index === null
      ? 'border-red-400 focus:border-red-500 ring-4 ring-red-500/20'
      : 'border-gray-200 focus:border-[#0078AE] focus:ring-4 focus:ring-[#0078AE]/20'}
    focus:outline-none
  `;

  const activityTypes = [
    { value: 'Employment', icon: 'fa-briefcase', color: 'blue', label: 'Employer Name' },
    { value: 'Education', icon: 'fa-graduation-cap', color: 'green', label: 'School Name' },
    { value: 'Community Service', icon: 'fa-hand-holding-heart', color: 'purple', label: 'Organization Name' }
  ];

  const getCurrentOrganizationLabel = () => {
    switch (currentActivity.activityType) {
      case 'Employment':
        return 'Employer Name';
      case 'Education':
        return 'School Name';
      case 'Community Service':
        return 'Organization Name';
      default:
        return 'Organization Name';
    }
  };

  const handleCurrentChange = (e) => {
    const { name, value } = e.target;
    setCurrentActivity(prev => ({ ...prev, [name]: value }));
  };

  const handleActivityTypeSelect = (type) => {
    setCurrentActivity(prev => ({
      ...prev,
      activityType: type,
      organizationName: ''
    }));
  };

  const addOrUpdateActivity = () => {
    // Validation
    if (!currentActivity.activityType) {
      alert('Please select activity type');
      return;
    }
    if (!currentActivity.organizationName?.trim()) {
      alert(`${getCurrentOrganizationLabel()} is required`);
      return;
    }
    if (!currentActivity.hoursPerMonth || currentActivity.hoursPerMonth < 1) {
      alert('Hours per month must be at least 1');
      return;
    }

    let updatedActivities;
    if (editIndex !== null) {
      // Update existing activity
      updatedActivities = [...activities];
      updatedActivities[editIndex] = { ...currentActivity };
    } else {
      // Add new activity
      updatedActivities = [...activities, { ...currentActivity }];
    }

    setActivities(updatedActivities);
    
    // Update formData
    const event = {
      target: {
        name: 'activities',
        value: updatedActivities
      }
    };
    onChange(event);

    // Reset current activity
    setCurrentActivity({
      activityType: '',
      organizationName: '',
      hoursPerMonth: ''
    });
    setEditIndex(null);
  };

  const editActivity = (index) => {
    setCurrentActivity(activities[index]);
    setEditIndex(index);
  };

  const removeActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
    
    // Update formData
    const event = {
      target: {
        name: 'activities',
        value: updatedActivities
      }
    };
    onChange(event);

    if (editIndex === index) {
      setCurrentActivity({
        activityType: '',
        organizationName: '',
        hoursPerMonth: ''
      });
      setEditIndex(null);
    }
  };

  const calculateTotalHours = () => {
    return activities.reduce((total, activity) => total + (parseInt(activity.hoursPerMonth) || 0), 0);
  };

  const totalHours = calculateTotalHours();

  return (
    <div className="space-y-6">
      {/* Activities List */}
      {activities.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <i className="fas fa-list text-[#0078AE] mr-2"></i>
            Added Activities ({activities.length})
          </label>
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <i className={`fas ${activityTypes.find(t => t.value === activity.activityType)?.icon} text-lg text-blue-500`}></i>
                    <span className="font-semibold text-gray-800">{activity.activityType}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editActivity(index)}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeActivity(index)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{getOrganizationLabel(activity.activityType)}:</span>
                    <span className="font-medium text-gray-800">{activity.organizationName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hours/Month:</span>
                    <span className="font-medium text-gray-800">{activity.hoursPerMonth} hrs</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Total Hours Summary */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Total Monthly Hours:</span>
                <span className={`font-bold text-lg ${totalHours >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                  {totalHours} hours
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Activity Form */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-plus-circle text-[#0078AE]"></i>
          {editIndex !== null ? 'Edit Activity' : 'Add New Activity'}
        </h3>
        
        <div className="space-y-5">
          {/* Activity Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <i className="fas fa-tasks text-[#0078AE] mr-2"></i>
              Activity Type
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activityTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleActivityTypeSelect(type.value)}
                  className={`
                    p-4 rounded-2xl border-2 transition-all duration-200
                    ${currentActivity.activityType === type.value
                      ? `border-${type.color}-500 bg-${type.color}-50 shadow-md`
                      : 'border-gray-200 bg-white/50 hover:border-gray-300'}
                  `}
                >
                  <i className={`fas ${type.icon} text-2xl text-${type.color}-500 mb-2 block`}></i>
                  <span className="font-medium text-gray-700">{type.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Organization Name */}
          {currentActivity.activityType && (
            <div>
              <label htmlFor="organizationName" className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-building text-[#0078AE] mr-2"></i>
                {getCurrentOrganizationLabel()}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="organizationName"
                type="text"
                name="organizationName"
                value={currentActivity.organizationName || ''}
                onChange={handleCurrentChange}
                className={inputClass('organizationName')}
                placeholder={`Enter ${getCurrentOrganizationLabel().toLowerCase()}`}
              />
            </div>
          )}

          {/* Hours Per Month */}
          {currentActivity.activityType && (
            <div>
              <label htmlFor="hoursPerMonth" className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-clock text-[#0078AE] mr-2"></i>
                Hours Per Month
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="hoursPerMonth"
                type="number"
                name="hoursPerMonth"
                value={currentActivity.hoursPerMonth || ''}
                onChange={handleCurrentChange}
                min="1"
                className={inputClass('hoursPerMonth')}
                placeholder="Average monthly commitment"
              />
            </div>
          )}

          {/* Add/Update Button */}
          {currentActivity.activityType && (
            <button
              type="button"
              onClick={addOrUpdateActivity}
              className="w-full py-3 bg-[#0078AE] text-white rounded-2xl font-semibold hover:bg-[#005f8e] transition-all flex items-center justify-center gap-2"
            >
              <i className={`fas ${editIndex !== null ? 'fa-save' : 'fa-plus'}`}></i>
              {editIndex !== null ? 'Update Activity' : 'Add Activity'}
            </button>
          )}
        </div>
      </div>

      {/* Hours Requirement Reminder */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
        <div className="flex items-start gap-2">
          <i className="fas fa-info-circle text-yellow-600 mt-0.5"></i>
          <div>
            <p className="text-sm font-semibold text-yellow-800">Eligibility Requirement</p>
            <p className="text-sm text-yellow-700">
              You need at least <span className="font-bold">80 total hours per month</span> across all activities to be eligible for Missouri Medicaid Program.
            </p>
            {totalHours > 0 && totalHours < 80 && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <i className="fas fa-exclamation-triangle"></i>
                Total: {totalHours} hours/month - Below the 80-hour requirement
              </p>
            )}
            {totalHours >= 80 && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <i className="fas fa-check-circle"></i>
                You meet the 80+ total hours/month requirement!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityInfo;