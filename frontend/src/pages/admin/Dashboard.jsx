import { useState, useEffect } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  LockOpenIcon,
  LockClosedIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { adminApi } from "../../services/adminApi";

const ROLES = ["All", "ADMIN", "EMPLOYEE", "APPLICANT"];

const ROLE_BADGE = {
  ADMIN: "bg-purple-100 text-purple-700",
  EMPLOYEE: "bg-blue-100 text-blue-700",
  APPLICANT: "bg-green-100 text-green-700",
};

const STATUS_BADGE = {
  ACTIVE: "bg-green-100 text-green-700",
  LOCKED: "bg-red-100 text-red-700",
  DISABLED: "bg-gray-100 text-gray-700",
};

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  middleName: "",
  email: "",
  role: "APPLICANT",
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  const [sortBy] = useState("id");
  const [sortDir] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(null);

  // Fetch users based on filter, search, and pagination
  const fetchUsers = async (pageNum = 0, filter = null, resetPage = false) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      const currentPage = resetPage ? 0 : pageNum;
      const currentFilter = filter !== null ? filter : activeFilter;

      if (searchMode && searchTerm.trim()) {
        response = await adminApi.searchUsers(
          searchTerm,
          currentPage,
          pageSize,
        );
      } else if (currentFilter !== "All") {
        // Get users by role with pagination
        const roleForApi = currentFilter.toUpperCase();
        response = await adminApi.getUsersByRole(
          roleForApi,
          currentPage,
          pageSize,
        );
      } else {
        response = await adminApi.getAllUsers(
          currentPage,
          pageSize,
          sortBy,
          sortDir,
        );
      }

      setUsers(response.users || []);
      setTotalPages(response.totalPages || 0);
      setTotalItems(response.totalItems || 0);
      setPage(response.currentPage || 0);

      if (resetPage) {
        setPage(0);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const statsData = await adminApi.getStatistics();
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchUsers(0, "All", true);
    fetchStats();
  }, []);

  // Handle filter change
  const handleFilterChange = async (role) => {
    setActiveFilter(role);
    setSelectedUsers([]);
    setSearchMode(false);
    setSearchTerm("");
    await fetchUsers(0, role, true);
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    const searchValue = searchTerm.trim();

    if (searchValue) {
      setLoading(true);
      setError(null);

      try {
        const response = await adminApi.searchUsers(searchValue, 0, pageSize);
        setSearchMode(true);
        setActiveFilter("All");
        setSelectedUsers([]);
        setUsers(response.users || []);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalItems || 0);
        setPage(0);
      } catch (err) {
        console.error("Error searching users:", err);
        setError(err.message || "Failed to search users");
      } finally {
        setLoading(false);
      }
    } else {
      clearSearch();
    }
  };

  const clearSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminApi.getAllUsers(0, pageSize, sortBy, sortDir);
      setSearchTerm("");
      setSearchMode(false);
      setActiveFilter("All");
      setSelectedUsers([]);
      setUsers(response.users || []);
      setTotalPages(response.totalPages || 0);
      setTotalItems(response.totalItems || 0);
      setPage(0);
      await fetchStats();
    } catch (err) {
      console.error("Error in clearSearch:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const getRoleCount = (role) => {
    if (!stats) return 0;
    if (role === "All") return stats.totalUsers || 0;
    if (role === "ADMIN") return stats.adminUsers || 0;
    if (role === "EMPLOYEE") return stats.employeeUsers || 0;
    if (role === "APPLICANT") return stats.applicantUsers || 0;
    return 0;
  };

  // Validation
  const validate = () => {
    const errors = {};
    if (!formData.firstName?.trim())
      errors.firstName = "First name is required.";
    if (!formData.lastName?.trim()) errors.lastName = "Last name is required.";
    if (!formData.email?.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address.";
    }
    return errors;
  };

  // Modal helpers
  const openAddModal = () => {
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setModalMode("add");
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      middleName: user.middleName || "",
      email: user.username || user.email || "",
      role: user.role || "APPLICANT",
    });
    setFormErrors({});
    setModalMode("edit");
    setEditingId(user.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSave = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      if (modalMode === "add") {
        await adminApi.createUser?.(formData);
      } else {
        await adminApi.updateUserInfo(editingId, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName,
          email: formData.email,
        });
      }
      closeModal();
      if (searchMode) {
        await handleSearch({ preventDefault: () => {} });
      } else {
        await fetchUsers(page, activeFilter);
      }
      await fetchStats();
    } catch (err) {
      setError(err.message || "Failed to save user");
      console.error("Error saving user:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await adminApi.deleteUser(deletingId);
      setShowDeleteConfirm(false);
      setDeletingId(null);
      if (searchMode) {
        await handleSearch({ preventDefault: () => {} });
      } else {
        await fetchUsers(page, activeFilter);
      }
      await fetchStats();
    } catch (err) {
      setError(err.message || "Failed to delete user");
      console.error("Error deleting user:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle lock/unlock account
  const handleToggleLock = async (userId, currentStatus) => {
    setLoading(true);
    try {
      const newStatus = currentStatus === "LOCKED" ? "ACTIVE" : "LOCKED";
      await adminApi.updateUserStatus(userId, newStatus);
      if (searchMode) {
        await handleSearch({ preventDefault: () => {} });
      } else {
        await fetchUsers(page, activeFilter);
      }
      await fetchStats();
    } catch (err) {
      setError(err.message || "Failed to update user status");
      console.error("Error updating status:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update role
  const handleRoleChange = async (userId, newRole) => {
    setRoleUpdateLoading(userId);
    try {
      await adminApi.updateUserRole(userId, newRole);
      if (searchMode) {
        await handleSearch({ preventDefault: () => {} });
      } else {
        await fetchUsers(page, activeFilter);
      }
      await fetchStats();
    } catch (err) {
      setError(err.message || "Failed to update user role");
      console.error("Error updating role:", err);
    } finally {
      setRoleUpdateLoading(null);
    }
  };

  // Bulk status update
  const handleBulkStatusUpdate = async (status) => {
    if (selectedUsers.length === 0) return;
    setLoading(true);
    try {
      await adminApi.bulkUpdateStatus(selectedUsers, status);
      setSelectedUsers([]);
      if (searchMode) {
        await handleSearch({ preventDefault: () => {} });
      } else {
        await fetchUsers(page, activeFilter);
      }
      await fetchStats();
    } catch (err) {
      setError(err.message || "Failed to update users");
      console.error("Error in bulk update:", err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const handlePreviousPage = () => {
    if (page > 0) fetchUsers(page - 1, activeFilter);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) fetchUsers(page + 1, activeFilter);
  };

  // Toggle user selection for bulk actions
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-[#0078AE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto py-8 my-10 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500 mt-1">
            Manage all system users and their account status.
          </p>
        </div>
        <div className="flex gap-3">
          {selectedUsers.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusUpdate("ACTIVE")}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <LockOpenIcon className="w-4 h-4" />
                Unlock ({selectedUsers.length})
              </button>
              <button
                onClick={() => handleBulkStatusUpdate("LOCKED")}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <LockClosedIcon className="w-4 h-4" />
                Lock ({selectedUsers.length})
              </button>
            </div>
          )}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-[#0078AE] hover:bg-[#005f8a] text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add User
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0078AE]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0078AE] text-white rounded-lg hover:bg-[#005f8a] transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={clearSearch}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Clear
          </button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ROLES.map((role) => (
          <button
            key={role}
            onClick={() => handleFilterChange(role)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
              ${
                activeFilter === role
                  ? "bg-[#0078AE] text-white border-[#0078AE]"
                  : "bg-white text-gray-600 border-gray-300 hover:border-[#0078AE] hover:text-[#0078AE]"
              }`}
          >
            {role === "All"
              ? "All Users"
              : role.charAt(0) + role.slice(1).toLowerCase() + "s"}
            <span className="ml-2 text-xs font-semibold">
              ({getRoleCount(role)})
            </span>
          </button>
        ))}
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === users.length && users.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                      {user.middleName && ` ${user.middleName}`}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.username}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        disabled={roleUpdateLoading === user.id}
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border-0 focus:ring-2 focus:ring-[#0078AE] ${
                          ROLE_BADGE[user.role] || ROLE_BADGE.APPLICANT
                        }`}
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="EMPLOYEE">Employee</option>
                        <option value="APPLICANT">Applicant</option>
                      </select>
                      {roleUpdateLoading === user.id && (
                        <span className="ml-2 text-xs text-gray-400">
                          Updating...
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          STATUS_BADGE[user.status] || STATUS_BADGE.ACTIVE
                        }`}
                      >
                        {user.status === "ACTIVE"
                          ? "✓ Active"
                          : user.status === "LOCKED"
                            ? "🔒 Locked"
                            : "⊘ Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleLock(user.id, user.status)}
                          title={
                            user.status === "LOCKED"
                              ? "Unlock account"
                              : "Lock account"
                          }
                          className={`p-1.5 rounded-md transition-colors ${
                            user.status === "LOCKED"
                              ? "text-amber-600 hover:bg-amber-50"
                              : "text-gray-400 hover:bg-gray-100 hover:text-amber-600"
                          }`}
                        >
                          {user.status === "LOCKED" ? (
                            <LockOpenIcon className="w-4 h-4" />
                          ) : (
                            <LockClosedIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          title="Edit user"
                          className="p-1.5 rounded-md text-[#0078AE] hover:bg-blue-50 transition-colors"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(user.id)}
                          title="Delete user"
                          className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with pagination */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-400">
            Showing {users.length} of {totalItems} user
            {totalItems !== 1 ? "s" : ""}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={page === 0}
              className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Total Users</div>
            <div className="text-2xl font-bold text-gray-800">
              {stats.totalUsers}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Active Users</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeUsers}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Locked Users</div>
            <div className="text-2xl font-bold text-red-600">
              {stats.lockedUsers}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Disabled Users</div>
            <div className="text-2xl font-bold text-gray-600">
              {stats.disabledUsers}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              {modalMode === "add" ? "Add New User" : "Edit User"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleFormChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078AE]
                    ${formErrors.firstName ? "border-red-400" : "border-gray-300"}`}
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleFormChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078AE]
                    ${formErrors.lastName ? "border-red-400" : "border-gray-300"}`}
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078AE]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078AE]
                    ${formErrors.email ? "border-red-400" : "border-gray-300"}`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {modalMode === "add" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078AE]"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="APPLICANT">Applicant</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-lg bg-[#0078AE] hover:bg-[#005f8a] text-white font-medium transition-colors disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : modalMode === "add"
                    ? "Add User"
                    : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Delete User
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
