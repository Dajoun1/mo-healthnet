import { useState } from "react";
import { PencilSquareIcon, TrashIcon, LockOpenIcon, LockClosedIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ROLES = ["All", "Admin", "Employee", "Applicant"];

const INITIAL_USERS = [
  { id: 1, firstName: "Alice", lastName: "Johnson", email: "alice@example.com", role: "Admin", locked: false },
  { id: 2, firstName: "Bob", lastName: "Smith", email: "bob@example.com", role: "Employee", locked: false },
  { id: 3, firstName: "Carol", lastName: "White", email: "carol@example.com", role: "Applicant", locked: true },
  { id: 4, firstName: "David", lastName: "Brown", email: "david@example.com", role: "Applicant", locked: false },
  { id: 5, firstName: "Eva", lastName: "Davis", email: "eva@example.com", role: "Employee", locked: true },
  { id: 6, firstName: "Frank", lastName: "Miller", email: "frank@example.com", role: "Admin", locked: false },
];

const ROLE_BADGE = {
  Admin: "bg-purple-100 text-purple-700",
  Employee: "bg-blue-100 text-blue-700",
  Applicant: "bg-green-100 text-green-700",
};

const EMPTY_FORM = { firstName: "", lastName: "", email: "", role: "Applicant" };

const AdminDashboard = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const filteredUsers =
    activeFilter === "All"
      ? users
      : users.filter((u) => u.role === activeFilter);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required.";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address.";
    }
    return errors;
  };

  // ── Modal helpers ────────────────────────────────────────────────────────────
  const openAddModal = () => {
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setModalMode("add");
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
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

  const handleSave = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (modalMode === "add") {
      const newUser = {
        id: Date.now(),
        ...formData,
        locked: false,
      };
      setUsers((prev) => [...prev, newUser]);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingId ? { ...u, ...formData } : u))
      );
    }
    closeModal();
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deletingId));
    setShowDeleteConfirm(false);
    setDeletingId(null);
  };

  // ── Unlock ───────────────────────────────────────────────────────────────────
  const handleToggleLock = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, locked: !u.locked } : u))
    );
  };

  return (
    <div className="container px-4 mx-auto py-8 my-10 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500 mt-1">Manage all system users and their account status.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#0078AE] hover:bg-[#005f8a] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ROLES.map((role) => (
          <button
            key={role}
            onClick={() => setActiveFilter(role)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
              ${activeFilter === role
                ? "bg-[#0078AE] text-white border-[#0078AE]"
                : "bg-white text-gray-600 border-gray-300 hover:border-[#0078AE] hover:text-[#0078AE]"
              }`}
          >
            {role}
            <span className="ml-2 text-xs font-semibold">
              ({role === "All" ? users.length : users.filter((u) => u.role === role).length})
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
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_BADGE[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.locked ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                          🔒 Locked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                          ✓ Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleLock(user.id)}
                          title={user.locked ? "Unlock account" : "Lock account"}
                          className={`p-1.5 rounded-md transition-colors ${
                            user.locked
                              ? "text-amber-600 hover:bg-amber-50"
                              : "text-gray-400 hover:bg-gray-100 hover:text-amber-600"
                          }`}
                        >
                          {user.locked ? (
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

        {/* Table footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
          Showing {filteredUsers.length} of {users.length} user{users.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Add / Edit Modal ───────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div data-testid="user-modal" className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative">
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
              {/* First Name */}
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
                  placeholder="Jane"
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
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
                  placeholder="Doe"
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                )}
              </div>

              {/* Email */}
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
                  placeholder="jane.doe@example.com"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078AE]"
                >
                  <option value="Admin">Admin</option>
                  <option value="Employee">Employee</option>
                  <option value="Applicant">Applicant</option>
                </select>
              </div>
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
                className="px-4 py-2 text-sm rounded-lg bg-[#0078AE] hover:bg-[#005f8a] text-white font-medium transition-colors"
              >
                {modalMode === "add" ? "Add User" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ──────────────────────────────────────────── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Delete User</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
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
                className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


