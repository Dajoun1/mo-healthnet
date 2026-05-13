import { useState, useEffect } from "react";
import { caseworkerApi } from "../../services/caseworkerApi";
import { useAuth } from "../../context/AuthContext";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  FunnelIcon,
  DocumentIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const STATUS_OPTIONS = ["All", "Pending", "Under_Review", "Approved", "Denied"];

const STATUS_BADGE = {
  Pending: "bg-yellow-100 text-yellow-700",
  Under_Review: "bg-blue-100 text-blue-700",
  Approved: "bg-green-100 text-green-700",
  Denied: "bg-red-100 text-red-700",
};

const CaseworkerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);

  useEffect(() => {
    fetchApplications();
    fetchStatistics();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedStatus]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await caseworkerApi.getAllApplications();
      setApplications(response.applications || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await caseworkerApi.getStatistics();
      setStats(stats);
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  const filterApplications = () => {
    if (selectedStatus === "All") {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(
        (app) => app.status === selectedStatus
      );
      setFilteredApplications(filtered);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApp(application);
    setReviewNotes(application.reviewNotes || "");
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

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedApp || !user) return;

    setUpdating(true);
    try {
      await caseworkerApi.updateApplicationStatus(
        selectedApp.id,
        newStatus,
        user.id,
        reviewNotes
      );
      await fetchApplications();
      await fetchStatistics();
      setShowDetailsModal(false);
      setSelectedApp(null);
      setReviewNotes("");
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.message || "Failed to update application status");
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignToMe = async () => {
    if (!selectedApp || !user) return;

    setAssigning(true);
    try {
      await caseworkerApi.assignApplication(selectedApp.id, user.id);
      await fetchApplications();
      // Update the selectedApp to reflect the change
      setSelectedApp(prev => ({
        ...prev,
        assignedTo: user.id,
        assignedToName: `${user.firstName} ${user.lastName}`
      }));
    } catch (err) {
      console.error("Error assigning application:", err);
      alert(err.message || "Failed to assign application");
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async () => {
    if (!selectedApp) return;

    setAssigning(true);
    try {
      await caseworkerApi.assignApplication(selectedApp.id, null);
      await fetchApplications();
      // Update the selectedApp to reflect the change
      setSelectedApp(prev => ({
        ...prev,
        assignedTo: null,
        assignedToName: null
      }));
    } catch (err) {
      console.error("Error unassigning application:", err);
      alert(err.message || "Failed to unassign application");
    } finally {
      setAssigning(false);
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
    <div className="container px-4 mx-auto py-8 my-10 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Caseworker Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Review and manage MO HealthNet applications
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Pending</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {stats.pending}
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Under Review</p>
                <p className="text-2xl font-bold text-blue-800">
                  {stats.underReview}
                </p>
              </div>
              <EyeIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Approved</p>
                <p className="text-2xl font-bold text-green-800">
                  {stats.approved}
                </p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Denied</p>
                <p className="text-2xl font-bold text-red-800">
                  {stats.denied}
                </p>
              </div>
              <XCircleIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      )}

      {/* Status Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedStatus === status
                ? "bg-[#0078AE] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {status.replace("_", " ")}
            {status !== "All" &&
              stats &&
              ` (${stats[status.charAt(0).toLowerCase() + status.slice(1).replace("_", "")]})`}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Applicant</th>
                <th className="px-6 py-3">Submitted</th>
                <th className="px-6 py-3">Household</th>
                <th className="px-6 py-3">Hours/Month</th>
                <th className="px-6 py-3">Assigned To</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-[#0078AE] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    No applications found
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      #{app.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-800 font-medium">
                        {app.applicantFullName || `User #${app.userId}`}
                      </div>
                      <div className="text-xs text-gray-500">{app.city}, {app.state}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(app.submittedAt)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {app.householdSize}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {app.totalHoursPerMonth}h
                    </td>
                    <td className="px-6 py-4">
                      {app.assignedToName ? (
                        <span className="text-gray-800 font-medium">
                          {app.assignedToName}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-sm">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          STATUS_BADGE[app.status]
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
                        Review
                      </button>
                    </td>
                  </tr>
                ))
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
              <p className="text-sm text-gray-600 mb-2">
                Applicant: {selectedApp.applicantFullName || `User #${selectedApp.userId}`}
              </p>

              {/* Assignment Status */}
              <div className="mb-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Assigned to:</span>
                  {selectedApp.assignedToName ? (
                    <span className="font-semibold text-gray-800">{selectedApp.assignedToName}</span>
                  ) : (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {selectedApp.assignedTo === user?.id ? (
                    <button
                      onClick={handleUnassign}
                      disabled={assigning}
                      className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {assigning ? "Unassigning..." : "Unassign Me"}
                    </button>
                  ) : !selectedApp.assignedTo ? (
                    <button
                      onClick={handleAssignToMe}
                      disabled={assigning}
                      className="px-3 py-1.5 text-sm bg-[#0078AE] text-white rounded-lg hover:bg-[#005f8a] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {assigning ? "Assigning..." : "Assign to Me"}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500 italic">Assigned to another caseworker</span>
                  )}
                </div>
              </div>

              {/* Application Details */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        STATUS_BADGE[selectedApp.status]
                      }`}
                    >
                      {selectedApp.status.replace("_", " ")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-medium">{formatDate(selectedApp.submittedAt)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Household Size</p>
                    <p className="font-medium">{selectedApp.householdSize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Hours/Month</p>
                    <p className="font-medium">{selectedApp.totalHoursPerMonth}h</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">
                    {selectedApp.streetAddress}<br />
                    {selectedApp.city}, {selectedApp.state} {selectedApp.zipCode}
                  </p>
                </div>

                {selectedApp.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedApp.phone}</p>
                  </div>
                )}

                {selectedApp.activities && selectedApp.activities.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Activities</p>
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

                {selectedApp.reviewNotes && (
                  <div>
                    <p className="text-sm text-gray-600">Previous Review Notes</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedApp.reviewNotes}</p>
                  </div>
                )}

                {/* Attachments Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 font-medium">Uploaded Documents</p>
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

              {/* Review Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078AE]"
                  rows={4}
                  placeholder="Add notes about this application..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpdateStatus("Under_Review")}
                  disabled={updating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Mark Under Review"}
                </button>
                <button
                  onClick={() => handleUpdateStatus("Approved")}
                  disabled={updating}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Approve"}
                </button>
                <button
                  onClick={() => handleUpdateStatus("Denied")}
                  disabled={updating}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Deny"}
                </button>
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
  );
};

export default CaseworkerDashboard;