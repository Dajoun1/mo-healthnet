import { useAuth } from "../../context/AuthContext";

const ApplicantDashboard = () => {
  const { user } = useAuth();

  const handleComingSoon = () => {
    // Placeholder — routing will be wired in a future Jira story
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome banner — pt-16 offsets the fixed navbar height */}
      <div className="bg-[#0078AE] text-white pt-24 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">
            Hi{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="text-blue-100 text-sm">
            Missouri Medicaid · Applicant Portal
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Primary actions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            What would you like to do?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Create Application */}
            <button
              type="button"
              onClick={handleComingSoon}
              disabled
              className="flex flex-col items-start gap-2 p-6 bg-white rounded-lg shadow-md border-2 border-dashed border-[#0078AE] opacity-60 cursor-not-allowed text-left"
            >
              <span className="text-2xl">📋</span>
              <span className="text-base font-semibold text-[#0078AE]">
                Create Application
              </span>
              <span className="text-xs text-gray-500">
                Start a new Medicaid benefits application.
              </span>
              <span className="mt-1 inline-block text-xs font-medium bg-blue-100 text-[#0078AE] rounded-full px-2 py-0.5">
                Coming soon
              </span>
            </button>

            {/* View Existing Applications */}
            <button
              type="button"
              onClick={handleComingSoon}
              disabled
              className="flex flex-col items-start gap-2 p-6 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300 opacity-60 cursor-not-allowed text-left"
            >
              <span className="text-2xl">🗂️</span>
              <span className="text-base font-semibold text-gray-700">
                View Existing Applications
              </span>
              <span className="text-xs text-gray-500">
                Track the status of your submitted applications.
              </span>
              <span className="mt-1 inline-block text-xs font-medium bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                Coming soon
              </span>
            </button>
          </div>
        </section>

        {/* Secondary info cards */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Account Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-base font-semibold mb-2 text-gray-700">
                Application Status
              </h3>
              <p className="text-sm text-gray-500">
                No active applications yet.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-base font-semibold mb-2 text-gray-700">
                Documents
              </h3>
              <p className="text-sm text-gray-500">
                Upload required documents once an application is started.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-base font-semibold mb-2 text-gray-700">
                Messages
              </h3>
              <p className="text-sm text-gray-500">No new messages.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApplicantDashboard;



