import React from "react";
import { Link } from "react-router-dom";

const WorkRequirementDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 md:py-20 lg:py-20 py-20">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Banner - Different phrasing */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-amber-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-amber-800 font-semibold">
                Work Requirement Update — Effective Immediately
              </p>
              <p className="text-amber-700 text-sm mt-1">
                Members aged <span className="font-bold">19-64</span> must
                complete <span className="font-bold">80 hours/month</span> of
                qualifying activities (employment, education, job training, or
                community service).{" "}
                <span className="font-bold">
                  Recertification required every 6 months.
                </span>
                <a
                  href="#"
                  className="text-amber-800 underline font-medium ml-1"
                >
                  View full policy →
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Action Cards Grid - Navigation to separate pages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Apply */}
          <div className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Submit Verification
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Upload your employment, education, or community service hours to
                satisfy the monthly requirement.
              </p>
              <Link
                to="/application"
                className="text-blue-600 font-medium text-sm hover:text-blue-700 inline-flex items-center gap-1"
              >
                Start application →
              </Link>
            </div>
          </div>

          {/* Card 2: Check Status */}
          <div className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Check Status
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                See if your verification has been approved, denied, or is still
                under review using your confirmation number.
              </p>
              <button
                disabled
                className="text-green-400 font-medium text-sm inline-flex items-center gap-1 cursor-not-allowed"
              >
                Coming soon →
              </button>
            </div>
          </div>

          {/* Card 3: Login */}
          <div className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Member Login
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Access your dashboard to view submission history, resubmission
                dates.
              </p>
              <Link
                to="/signin"
                className="text-purple-600 font-medium text-sm hover:text-purple-700 inline-flex items-center gap-1"
              >
                Sign in →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkRequirementDashboard;
