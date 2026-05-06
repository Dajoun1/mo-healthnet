import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const STATUS_BADGE = {
  Pending: "bg-yellow-100 text-yellow-700",
  Under_Review: "bg-blue-100 text-blue-700",
  Approved: "bg-green-100 text-green-700",
  Denied: "bg-red-100 text-red-700",
};

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(""), 5000);
    }
    fetchApplications();
  }, [location]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/applications/user/${user.id}`);
      setApplications(response.data.applications || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApp(application);
    setShowDetailsModal(true);
    fetchAttachments(application.id);
  };

  const fetchAttachments = async (applicationId) => {
    setLoadingAttachments(true);
    try {
      const response = await fetch(`http://localhost:8080/api/attachments/application/${applicationId}`);
      const data = await response.json();
      setAttachments(data.attachments || []);
    } catch (err) {
      console.error("Error fetching attachments:", err);
      setAttachments([]);
    } finally {
      setLoadingAttachments(false);
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await fetch(`http://localhost:8080/api/attachments/download/${fileId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading file:", err);
      alert("Failed to download file");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-600">
            View and track your submitted applications
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3">Application ID</th>
                  <th className="px-6 py-3">Submitted</th>
                  <th className="px-6 py-3">Household Size</th>
                  <th className="px-6 py-3">Total Hours</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-[#0078AE] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      No applications found. Apply for coverage to get started!
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => {
                    const totalHours = app.activities?.reduce(
                      (sum, act) => sum + (act.hoursPerMonth || 0),
                      0
                    ) || 0;

                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          #{app.id}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(app.submittedAt)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {app.householdSize}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {totalHours} hrs/month
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              STATUS_BADGE[app.status] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {app.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleViewDetails(app)}
                            className="text-[#0078AE] hover:text-[#005f8a] font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  Application #{selectedApp.id}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Submitted: {formatDate(selectedApp.submittedAt)}
                </p>

                {/* Status Badge */}
                <div className="mb-6">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      STATUS_BADGE[selectedApp.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedApp.status.replace("_", " ")}
                  </span>
                </div>

                {/* Application Details */}
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Personal Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-gray-800">
                          {selectedApp.streetAddress}, {selectedApp.city}, {selectedApp.state}{" "}
                          {selectedApp.zipCode}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-800">
                          {selectedApp.phone || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Household Size:</span>
                        <span className="font-medium text-gray-800">
                          {selectedApp.householdSize}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Activities */}
                  {selectedApp.activities && selectedApp.activities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Activity Information
                      </h3>
                      <div className="space-y-2">
                        {selectedApp.activities.map((activity, idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded">
                            <p className="font-medium">{activity.activityType.replace("_", " ")}</p>
                            <p className="text-sm text-gray-600">{activity.organizationName}</p>
                            <p className="text-sm text-gray-600">{activity.hoursPerMonth}h/month</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Review Notes */}
                  {selectedApp.reviewNotes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Review Notes
                      </h3>
                      <p className="text-sm bg-gray-50 p-3 rounded">{selectedApp.reviewNotes}</p>
                    </div>
                  )}

                  {/* Attachments Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">Uploaded Documents</h3>
                      {loadingAttachments && (
                        <span className="text-xs text-gray-400">Loading...</span>
                      )}
                    </div>
                    {attachments.length > 0 ? (
                      <div className="space-y-2">
                        {attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2">
                              <DocumentIcon className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-800">{attachment.fileName}</p>
                                <p className="text-xs text-gray-500">
                                  Uploaded {formatDate(attachment.uploadedAt)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownloadFile(attachment.fileId, attachment.fileName)}
                              className="flex items-center gap-1 text-[#0078AE] hover:text-[#005f8a] text-sm font-medium"
                            >
                              <ArrowDownTrayIcon className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <DocumentIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No documents uploaded</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantDashboard;

